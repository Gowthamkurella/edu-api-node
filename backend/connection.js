const { Pool } = require('pg');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, ENDPOINT_ID } = process.env;

// Adjust the configuration object to match the Pool's expected options
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: PGPORT || 5432,
  ssl: {
    rejectUnauthorized: false, // Depending on your SSL requirements
  },
  // connection options are not directly supported here; might need adjustments based on actual requirements
});

async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT version()');
    console.log(result.rows);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

getPgVersion();
