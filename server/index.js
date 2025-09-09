require('dotenv').config();
const express = require('express');
// const multer = require("multer");
const cookieParser = require('cookie-parser');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const app = express();
const { pool, createDBIfNotExist, createTablesIfNotExist } = require('./db');
const { Server } = require('socket.io');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

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

// ************************************************************************************************************
//                                  SOCKET IO SERVER
// ************************************************************************************************************
const server = http.createServer(app);

server.listen(3001, () => {
  console.log('SERVER RUNNING 3001');
});
