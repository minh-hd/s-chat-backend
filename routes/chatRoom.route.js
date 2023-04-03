import express from 'express';
import chatRoomController from '../controllers/chatRoom.controller.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRoom:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the chat room
 *         userIds:
 *           type: array
 *           description: Id of users in the room
 *         type:
 *           type: string
 *           description: The chatroom type
 *         chatInitiator:
 *           type: string
 *           description: Id of an user who created the chatroom
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the chatroom was added
 */

/**
 * @swagger
 * tags:
 *   name: Chat Room
 *   description: The Chat Room Handling API
 * /:
 *   get:
 *     summary: Get recent conversations
 *     tags: [Chatroom]
 *     security:
 *        - Authorization: []
 *     responses:
 *       200:
 *         description: Get recent conversations.
 *       500:
 *         description: Internal server error
 *
 */

const router = express.Router();

router
  .get('/', chatRoomController.getRecentConversation)
  .get('/:roomId', chatRoomController.getConversationByRoomId)
  .post('/initiate', chatRoomController.initiate)
  .post('/:roomId/message', chatRoomController.postMessage)
  .put('/:roomId/mark-read', chatRoomController.markConversationReadByRoomId);

export default router;
