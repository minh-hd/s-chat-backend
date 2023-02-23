import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import userModel from '../models/user.model.js';

dotenv.config();

const { SALT_ROUNDS } = process.env;

export default {
  createUser: async (user) => {
    try {
      const { password, ...rest } = user;
      const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS));

      const hashedPassword = bcrypt.hashSync(password, salt);

      return await userModel.create({ password: hashedPassword, ...rest });
    } catch (error) {
      console.error(error);
    }
  }
};
