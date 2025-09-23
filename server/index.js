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

// **************authenticate middleware****************
function authToken(req, res, next) {
  // const token = req.headers['x-access-token'];
  const token = req.headers.authorization;

  if (token === null) {
    return res.status(401).send('You need a token');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
    if (err) {
      return res.status(403).send('Failed authentication');
    }

    req.payload = payload;
    next();
  });
}

// *****************generate access token*********************
function generateAccessToken(payload) {
  // return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15s' });
  return jwt.sign(payload, process.env.ACCESS_TOKEN);
}
// *****************generate refresh token*********************
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN);
}

// *****************new token from refresh token*********************
app.post('/users/refresh', async (req, res) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(401).json({ error: 'Token not found' });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      const access_token = generateAccessToken(payload);
      const refresh_token = generateRefreshToken(payload);
      res
        .cookie('refresh_token', refresh_token, {
          secure: true,
          httpOnly: true,
          path: '/',
        })
        .json({ access_token });
    });
  } catch (err) {
    console.log(err.message);
  }
});

// *****************verify http-only cookie*********************
app.post('/users/verify', async (req, res) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(401).json({ error: 'Cookie not found' });
    } else {
      return res.status(200).json('Cookie found');
    }
  } catch (err) {
    console.log(err.message);
  }
});

//get current username from token
app.get('/users/username', authToken, async (req, res) => {
  try {
    res.json(req.payload.username);
  } catch (err) {
    console.log(err.message);
  }
});

//get current user id from token
app.get('/users/userid', authToken, async (req, res) => {
  try {
    res.json(req.payload.id);
  } catch (err) {
    console.log(err.message);
  }
});

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

// ***************************************************************************************
//                                     DELETE ACCOUNT
// ***************************************************************************************

// delete user account
app.delete('/users/delete', authToken, async (req, res) => {
  try {
    console.log(req.payload.id);
    const deleteUser = await pool.query('DELETE FROM users WHERE id=$1;', [
      req.payload.id,
    ]);
    res.json('User was deleted');
  } catch (err) {
    console.log(err.message);
  }
});

// delete all user links - users_channels table
app.delete('/users/deleteusersalllinks', authToken, async (req, res) => {
  try {
    const deleteLinks = await pool.query(
      'DELETE FROM users_channels WHERE channels_id IN ( SELECT id FROM channels WHERE host[1] = $1 );',
      [req.payload.id]
    );
    res.json(deleteLinks.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//delete remaining host links - users_channels table
app.delete('/users/deletehostalllinks', authToken, async (req, res) => {
  try {
    const deleteLinks = await pool.query(
      'DELETE FROM users_channels WHERE users_id = $1;',
      [req.payload.id]
    );
    res.json(deleteLinks.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// delete all of users chat channels - channels table
app.delete('/users/deletehostallchannels', authToken, async (req, res) => {
  try {
    const deleteChannels = await pool.query(
      'DELETE FROM channels WHERE host[1] = $1;',
      [req.payload.id]
    );
    res.json(deleteChannels.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// ***************************************************************************************
//                                     UPDATE ACCOUNT
// ***************************************************************************************

//****************NOTE: CONST VARIABLES MUST HAVE EXACTLY THE SAME NAME AS REQ.BODY*********************** */
//update user username
app.put('/users/updateusername', authToken, async (req, res) => {
  try {
    const { username } = req.body;
    const changeUsername = await pool.query(
      'UPDATE users SET username=$1 WHERE id=$2',
      [username, req.payload.id]
    );
  } catch (err) {
    console.log(err.message);
  }
});

//update user email
app.put('/users/updateemail', authToken, async (req, res) => {
  try {
    const { email } = req.body;
    const changeEmail = await pool.query(
      'UPDATE users SET email=$1 WHERE id=$2',
      [email, req.payload.id]
    );
  } catch (err) {
    console.log(err.message);
  }
});

//update user password
app.put('/users/updatepassword', authToken, async (req, res) => {
  try {
    const { password } = req.body;
    const hashed = await argon2.hash(password);
    const changePassword = await pool.query(
      'UPDATE users SET hashpassword=$1 WHERE id=$2',
      [hashed, req.payload.id]
    );
  } catch (err) {
    console.log(err.message);
  }
});

//get user email
app.get('/users/useremail', authToken, async (req, res) => {
  try {
    const userEmail = await pool.query('SELECT email FROM users WHERE id=$1', [
      req.payload.id,
    ]);
    res.json(userEmail);
  } catch (err) {
    console.log(err.message);
  }
});

//get user password
app.post('/users/userpassword', authToken, async (req, res) => {
  try {
    const { current_password } = req.body;
    const hashPassword = await pool.query(
      'SELECT hashpassword FROM users WHERE id=$1',
      [req.payload.id]
    );
    const hashVerify = await argon2.verify(
      hashPassword.rows[0].hashpassword,
      current_password
    );
    res.json(hashVerify);
  } catch (err) {
    console.log(err.message);
  }
});

// ***************************************************************************************
//                                     CHAT APP
// ***************************************************************************************

// ***************************************************************************************
//                                     CHATLIST
// ***************************************************************************************
//check if chat still exists when sending message or clicking on chat room
app.get('/users/chatstillexists/:chatid', async (req, res) => {
  try {
    const { chatid } = req.params;
    const result = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM channels WHERE id=$1);',
      [chatid]
    );
    res.json(result.rows[0].exists);
  } catch (err) {
    console.log(err.message);
  }
});

//get users list of channels
app.get('/users/userschannels', authToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT channels.ID, channels.channelname, channels.host, channels.messages FROM channels JOIN users_channels ON channels.ID = users_channels.channels_id JOIN users ON users_channels.users_id = users.ID WHERE users.ID = $1;',
      [req.payload.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
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
