import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_PORT, DB_NAME: name } = process.env;

const url = `${DB_HOST}:${DB_PORT}`;

const config = {
  db: {
    url,
    name
  }
};

export default config;
