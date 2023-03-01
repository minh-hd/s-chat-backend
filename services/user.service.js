import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import userModel from '../models/user.model.js';

dotenv.config();

const { SALT_ROUNDS } = process.env;

const GENERAL_USER_QUERIES = { _id: 1, firstName: 1, lastName: 1, username: 1 };

/**
 *
 * @param {*} user
 * @returns
 */
async function createUser(user) {
  const { password, username, ...rest } = user;

  const existedUser = await findUserByUsername(username);

  if (existedUser) {
    throw new Error('An user has existed with this username');
  }

  const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS));

  const hashedPassword = bcrypt.hashSync(password, salt);

  return await userModel.create({
    password: hashedPassword,
    username,
    ...rest
  });
}

/**
 *
 * @param {*} username
 * @param {*} password
 * @returns
 */
async function checkUserCredentials(username, password) {
  const existedUser = await findUserByUsername(username);

  if (!existedUser) {
    throw new Error('No user found with this username');
  }

  return bcrypt.compareSync(password, existedUser.password);
}

/**
 *
 * @param {*} username
 * @returns
 */
async function findUserByUsername(username) {
  const user = await userModel.findOne({ username }).exec();

  if (!user) {
    return false;
  }

  return user;
}

/**
 *
 * @param {*} id
 * @returns
 */
async function findUserById(id) {
  const user = await userModel
    .findOne({ _id: id })
    .select(GENERAL_USER_QUERIES)
    .exec();

  if (!user) {
    return false;
  }

  return user;
}

async function findUsers() {
  return await userModel.find().select(GENERAL_USER_QUERIES).exec();
}

export default {
  createUser,
  findUserByUsername,
  findUserById,
  findUsers,
  checkUserCredentials
};
