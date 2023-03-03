import makeValidation from '@withvoid/make-validation';
import { CHAT_ROOM_TYPES } from '../constants/chatRoom.constant.js';
import chatRoomService from '../services/chatRoom.service.js';
import chatMessageService from '../services/chatMessage.service.js';

export default {
  initiate: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          userIds: {
            type: types.array,
            options: { unique: true, empty: false, stringOnly: true }
          },
          type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } }
        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { userIds, type } = req.body;
      const { userId: chatInitiator } = req;

      const allUserIds = [...userIds, chatInitiator];

      const chatRoom = await chatRoomService.initiateChat(
        allUserIds,
        type,
        chatInitiator
      );

      return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  postMessage: async (req, res) => {
    try {
      const { roomId } = req.params;
      const { messageText } = req.body;
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          messageText: { type: types.string }
        }
      }));

      if (!validation.success) {
        return res.status(400).json({ ...validation });
      }

      const { userId: currentLoggedUser } = req;

      const readResult = await chatMessageService.markMessageAsRead(
        roomId,
        currentLoggedUser
      );

      global.io.sockets
        .in(roomId)
        .emit('read message', { message: readResult });

      return res.status(200).json({ success: true, readResult });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  getRecentConversation: async (req, res) => {},
  getConversationByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  markConversationReadByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await chatRoomService.findRoomById(roomId);

      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id'
        });
      }

      const messagePayload = {
        messageText
      };

      const currentLoggedUser = req.userId;
      const post = await chatMessageService.createPostInChatRoom(
        roomId,
        messagePayload,
        currentLoggedUser
      );

      global.io.sockets.in(roomId).emit('new message', { message: post });

      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};
