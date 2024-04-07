require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
      rejectUnauthorized: true,
    }
  });

const generateUserId = async () => {
  try {
    const result = await pool.query('SELECT userid FROM users ORDER BY created_at DESC LIMIT 1');
    if (result.rows.length > 0) {
      const lastUserId = result.rows[0].userid;
      const numericPart = parseInt(lastUserId.substring(3)) + 1; 
      return `UID${numericPart}`;
    } else {
      return 'UID100';
    }
  } catch (error) {
    console.error('Error generating user ID:', error);
    throw error; 
  }
};

module.exports = {
  generateUserId,
};
