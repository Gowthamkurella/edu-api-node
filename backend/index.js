const express = require('express');
require('dotenv').config();
const db = require('./connection');
const app = express();


app.use(express.json());


app.get('/', (req, res) => {
  res.send('EduConnect API is running...');
});

app.listen(5000, () => console.log(`Server running on port 5000`));
