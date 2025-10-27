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
async function createDBIfNotExist() {
  try {
    await pool.connect();

    const res = await pool.query(
      `SELECT 1 FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`
    );

    if (res.rowCount === 0) {
      await pool.query(`CREATE DATABASE db;`);
    } else {
      console.log(`Database ${DB_NAME} already exists`);
    }
  } catch (err) {
    console.error('Error for database creating setup: ', err);
    throw err;
  }
}

//CREATE TABLE IF IT DOESNT EXIST
async function createTablesIfNotExist() {
  try {
    await pool.connect();

    await pool.query(`CREATE TABLE IF NOT EXISTS users(
            ID SERIAL NOT NULL PRIMARY KEY,
            profilepic BYTEA,
            username VARCHAR(255),
            email VARCHAR(255),
            hashpassword VARCHAR(255)
        );`);

    await pool.query(`CREATE TABLE IF NOT EXISTS channels(
            ID SERIAL NOT NULL PRIMARY KEY,
            channelpic BYTEA,
            channelname TEXT,
            host TEXT[],
            messages JSONB
        );`);

    await pool.query(`CREATE TABLE IF NOT EXISTS users_channels(
            users_id INT,
            channels_id INT,
            PRIMARY KEY (users_id, channels_id),
            CONSTRAINT fk_users FOREIGN KEY(users_id) REFERENCES users(ID),
            CONSTRAINT fk_channels FOREIGN KEY(channels_id) REFERENCES channels(ID)
        );`);
  } catch (err) {
    console.error('Error for database table setup: ', err);
    throw err;
  }
}

// module.exports = pool;
module.exports = { pool, createDBIfNotExist, createTablesIfNotExist };
