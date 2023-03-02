import jwt from 'jsonwebtoken';
import makeValidation from '@withvoid/make-validation';

import userService from '../services/user.service.js';

const SECRET_KEY = 'very-secret-key';

export const decode = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res
      .status(400)
      .json({ success: false, message: 'No access token provided' });
  }

  const accessToken = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);

    req.userId = decoded.userId;
    req.username = decoded.username;

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const encode = async (req, res, next) => {
  try {
    const validation = makeValidation((types) => ({
      payload: req.body,
      checks: {
        username: { type: types.string },
        password: { type: types.string }
      }
    }));

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const { username, password } = req.body;

    const user = await userService.checkUserCredentials(username, password);

    if (!user) {
      throw new Error('Invalid login credentials');
    }

    const payload = {
      userId: user._id,
      username: user.username
    };

    const authToken = jwt.sign(payload, SECRET_KEY);

    req.authToken = authToken;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
