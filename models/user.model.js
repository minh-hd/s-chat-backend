import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, '')
    },
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    profilePicture: String
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

export default mongoose.model('User', userSchema);
