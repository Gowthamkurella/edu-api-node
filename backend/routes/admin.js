const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { pool } = require('../utils');
const {getDetails} = require('../utils');
const {generateCourseId} = require('../utils');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(403).send({ message: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });
    req.userId = decoded.userId; 
    req.role = decoded.role; 
    next();
  });
};


router.get('/courses', verifyToken, async (req, res) => {
  try {
    const allCourses = await pool.query('SELECT * FROM courses');
    const userDetails  = await getDetails(req.userId,req.role);
    res.json({
        courses: allCourses.rows,
        userDetails 
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/add-courses', verifyToken, async (req, res) => {
    const { coursename, category, level } = req.body;
  
    if (!coursename || !category || !level) {
      return res.status(400).send({ message: 'Missing required fields.' });
    }
  
    try {
      const courseId = await generateCourseId(); 
      console.log(courseId);
      const result = await pool.query(
        'INSERT INTO courses (courseid, coursename, category, level, popularity) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [courseId, coursename, category, level, 0] 
      ); 
      res.status(201).json(result.rows[0]); 
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).send({ message: 'Failed to add course.' });
    }
  });

module.exports = router;
