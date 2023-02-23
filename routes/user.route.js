import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router
  .get('/', userController.onGetAllUsers)
  .post('/', userController.onCreateUser)
  .get('/:id', userController.onGetUserById)
  .delete('/:id', userController.onDeleteUserById);

export default router;
