import chatRoomModel from '../models/chatRoom.model.js';

/**
 *
 * @param {*} userIds
 * @returns
 */
async function findAvailableRoom(userIds) {
  const availableRoom = await chatRoomModel
    .findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds]
      }
    })
    .exec();

  if (!availableRoom) {
    return null;
  }

  return availableRoom;
}

/**
 *
 * @param {*} userIds
 * @param {*} type
 * @param {*} chatInitiator
 * @returns
 */
async function initiateChat(userIds, type, chatInitiator) {
  const availableRoom = await findAvailableRoom(userIds);

  if (availableRoom) {
    return {
      isNew: false,
      message: 'retrieving an old chat room',
      chatRoomId: availableRoom._id,
      type: availableRoom.type
    };
  }

  const newRoom = await chatRoomModel.create({
    userIds,
    type,
    chatInitiator
  });

  return {
    isNew: true,
    message: 'creating a new chat room',
    chatRoomId: newRoom._id,
    type: newRoom.type
  };
}

/**
 *
 * @param {*} roomId
 * @returns
 */
async function findRoomById(roomId) {
  const room = await chatRoomModel.findOne({ _id: roomId }).exec();

  return room ? null : room;
}

export default {
  findAvailableRoom,
  findRoomById,
  initiateChat
};
