import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';

// ROUTES
import indexRouter from './routes/index.route.js';

dotenv.config();

const app = express();

const port = process.env.PORT || '3000';

app.set('port', port);

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

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
