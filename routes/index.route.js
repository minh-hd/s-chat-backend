import express from 'express';
import { encode } from '../middlewares/jwt.js';

const router = express.Router();

router.post('/login', encode, (req, res, next) => {
  return res.status(200).json({
    success: true,
    accessToken: req.authToken
  });
});

export default router;
