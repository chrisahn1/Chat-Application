require('dotenv').config();
const express = require('express');
// const multer = require("multer");
const cookieParser = require('cookie-parser');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const app = express();
const Pool = require('pg').Pool;
// const { pool, createDBIfNotExist, createTablesIfNotExist } = require('./db');
const { Server } = require('socket.io');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const pool = new Pool({
  connectionString: 'postgres://dev:dev@localhost/chat-db',
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());

//ROUTES//
// ***************************************************************************************
//                                     LOGIN/SIGNUP
// ***************************************************************************************
app.post('/users/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await argon2.hash(password);
    const newData = await pool.query(
      'INSERT INTO users (username, email, hashpassword) VALUES($1, $2, $3) RETURNING *',
      [username, email, hashed]
    );
    res.json(newData);
  } catch (error) {
    console.log(error.message);
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const newData = await pool.query(
      `SELECT id, username, hashpassword FROM users WHERE email=$1`,
      [email]
    );

    if (newData.rows.length === 0) {
      res.json('wrong');
    } else {
      const [user] = newData.rows;
      const { id, username, hashpassword } = user;

      const hashVerify = await argon2.verify(hashpassword, password);

      if (hashVerify === true) {
        const payload = { id, username };
        const access_token = generateAccessToken(payload);
        const refresh_token = generateRefreshToken(payload);
        res
          .cookie('refresh_token', refresh_token, {
            secure: true,
            httpOnly: true,
            path: '/',
          })
          .json({ access_token });
      } else {
        res.json('wrong');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.delete('/users/logout', async (req, res) => {
  try {
    res.clearCookie('refresh_token', { path: '/' });
    res.status(200).json('token deleted.');
  } catch (error) {
    console.log(error.message);
  }
});

// *****************generate access token*********************
function generateAccessToken(payload) {
  // return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15s' });
  return jwt.sign(payload, process.env.ACCESS_TOKEN);
}
// *****************generate refresh token*********************
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN);
}
//get user username and email
app.post('/users/signupcheck', async (req, res) => {
  try {
    const { username, email } = req.body;
    const verify_username = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM users WHERE username=$1);',
      [username]
    );
    const verify_email = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM users WHERE email=$1);',
      [email]
    );
    if (verify_username.rows[0].exists === true) {
      res.json('invalid');
    } else if (verify_email.rows[0].exists === true) {
      res.json('invalid');
    } else {
      res.json('valid');
    }
  } catch (error) {
    console.log(error.message);
  }
});
// ************************************************************************************************************
//                                  SOCKET IO SERVER
// ************************************************************************************************************
const server = http.createServer(app);

server.listen(3001, () => {
  // createDBIfNotExist();
  // createTablesIfNotExist();
  console.log('SERVER RUNNING 3001');
});
