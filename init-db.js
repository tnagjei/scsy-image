const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const sql = fs.readFileSync('./src/backend/sql/init.sql', 'utf8');

pool.query(sql)
  .then(() => {
    console.log('Database initialized successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });