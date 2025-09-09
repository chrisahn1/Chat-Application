const Pool = require('pg').Pool;

const DB_NAME = 'db';

const pool = new Pool({
  user: 'postgres',
  password: 'huhhuh07',
  host: 'localhost',
  port: 5432,
  database: 'db',
});

//CREATE DATABASE IF IT DOESNT EXIST
// async function createDBIfNotExist() {
//   //NEEDS WORK
// };

//CREATE TABLE IF IT DOESNT EXIST
// async function createTablesIfNotExist() {
//   //NEEDS WORK
// };

// module.exports = pool;
module.exports = { pool };
