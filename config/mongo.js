import mongoose from 'mongoose';
import config from './index.js';

const {
  db: { name, url }
} = config;

const CONNECTION_URL = `mongodb://${url}/${name}`;

mongoose.connect(CONNECTION_URL);

mongoose.connection.on('connected', () =>
  console.log('Mongo has connected successfully! ✅')
);

mongoose.connection.on('reconnected', () =>
  console.log('Mongo has reconnected 🔄')
);

mongoose.connection.on('error', (error) => {
  console.log('Mongo connection has an error ❌', error);
  mongoose.disconnect();
});

mongoose.connection.on('disconnected', () =>
  console.log('Mongo connection is disconnected ⏹')
);
