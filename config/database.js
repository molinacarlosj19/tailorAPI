// database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost', // Your PostgreSQL host
  database: 'taylordb', // Your PostgreSQL database name
  password: 'Dejesus28', // Your PostgreSQL password
  port: 5432, // Your PostgreSQL port (default is 5432)
});

module.exports = pool;
