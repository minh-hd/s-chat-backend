import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, '')
    },
    userIds: Array,
    type: String,
    chatInitiator: String
  },
  {
    timestamps: true,
    collection: 'chatrooms'
  }
);

export default mongoose.model('ChatRoom', chatRoomSchema);
