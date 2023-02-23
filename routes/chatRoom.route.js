import express from 'express';
import chatRoomController from '../controllers/chatRoom.controller.js';

const router = express.Router();

router
  .get('/', chatRoomController.getRecentConversation)
  .get('/:roomId', chatRoomController.getConversationByRoomId)
  .post('/initiate', chatRoomController.initiate)
  .post('/:roomId/message', chatRoomController.postMessage)
  .put('/:roomId/mark-read', chatRoomController.markConversationReadByRoomId);

export default router;
