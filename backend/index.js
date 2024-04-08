require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const app = express();
const { Resend } = require('resend');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { generateUserId } = require('./utils');
const adminRoutes = require('./routes/admin');
const { pool } = require('./utils');
const userRoutes = require('./routes/users');

app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/user',userRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "educonnect_profiles",
  allowedFormats: ["jpg", "png", "jpeg"],
});

const parser = multer({ storage: storage });
const resend = new Resend('re_hN6mMtxn_Guu7tcNMEv1mEM96FfQzj1Y4');


app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  let queryText;
  if (role === 'admin') {
    queryText = 'SELECT * FROM admins WHERE email = $1';
  } else if (role === 'student') {
    queryText = 'SELECT * FROM users WHERE email = $1';
  } else {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  try {
    const userQuery = await pool.query(queryText, [email]);

    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];

      let isAuthenticated = false;
      if (role === 'admin') {
        isAuthenticated = password === user.password; 
      } else if (role === 'student') {
        isAuthenticated = await bcrypt.compare(password, user.password); 
      }

      if (isAuthenticated) {
        const token = jwt.sign(
          { userId: user.userid || user.adminid, role: role },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );
        console.log(token);
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Your OTP for EduConnect Registration',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  h1 {
    color: #0056b3;
  }
  .otp {
    font-size: 24px;
    font-weight: bold;
  }
</style>
</head>
<body>
<div class="container">
  <h1>EduConnect Account Verification</h1>
  <p>Dear user,</p>
  <p>Thank you for registering with EduConnect. To complete your registration, please use the following One-Time Password (OTP):</p>
  <p class="otp">${otp}</p>
  <p>This OTP is valid for 10 minutes and is for one-time use only.</p>
  <p>If you did not initiate this request, please ignore this email or contact support if you have concerns.</p>
  <p>Best Regards,<br>EduConnect Team</p>
</div>
</body>
</html>
`

    });
    res.json({ otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
});

app.post('/register', parser.single('profilePic'), async (req, res) => {
  const { name, email, password, semester } = req.body;
  const profilePicUrl = req.file ? req.file.path : null;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userid = await generateUserId();
  try {
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists.' });
    }
    const newUser = await pool.query(
      'INSERT INTO users (userid,name, email, password, profile_picture_url, semester) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *',
      [userid,name, email, hashedPassword, profilePicUrl, semester]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(5000, () => console.log(`Server running on port 5000`));
