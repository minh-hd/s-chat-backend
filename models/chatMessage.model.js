import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_TYPES } from '../constants/chatMessage.constant.js';

const readByRecipientSchema = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: false
  }
);

const chatMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, '')
    },
    chatRoomId: String,
    message: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TEXT
    },
    postedByUser: String,
    readByRecipients: [readByRecipientSchema]
  },
  {
    timestamps: true,
    collection: 'chatmessages'
  }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
