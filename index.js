import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';

import './config/mongo.js';

// ROUTES
import indexRouter from './routes/index.route.js';
import userRouter from './routes/user.route.js';
import chatRoomRouter from './routes/chatRoom.route.js';
import deleteRouter from './routes/delete.route.js';

import { decode } from './middlewares/jwt.js';

dotenv.config();

const app = express();

global.env = process.env;

const port = process.env.APP_PORT || '3000';

app.set('port', port);

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/room', decode, chatRoomRouter);
app.use('/delete', deleteRouter);

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint does not exist'
  });
});

const server = http.createServer(app);

server.listen(port);

server.on('listening', () =>
  console.log(`Listening on port:: http://localhost:${port}/`)
);
