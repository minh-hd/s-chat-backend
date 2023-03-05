import chatMessageModel from '../models/chatMessage.model.js';

async function createPostInChatRoom(chatRoomId, message, postedByUser) {
  const post = await chatMessageModel.create({
    chatRoomId,
    message,
    postedByUser,
    readByRecipients: {
      readByUserId: postedByUser
    }
  });

  // TODO: validate output
  const aggregate = await chatMessageModel
    .aggregate([
      { $match: { _id: post._id } },
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: '_id',
          as: 'postedByUser'
        }
      },
      { $unwind: '$postedByUser' },
      // do a join on another table called chatrooms, and
      // get me a chatroom whose _id = chatRoomId
      {
        $lookup: {
          from: 'chatrooms',
          localField: 'chatRoomId',
          foreignField: '_id',
          as: 'chatRoomInfo'
        }
      },
      { $unwind: '$chatRoomInfo' },
      { $unwind: '$chatRoomInfo.userIds' },
      // do a join on another table called users, and
      // get me a user whose _id = userIds
      {
        $lookup: {
          from: 'users',
          localField: 'chatRoomInfo.userIds',
          foreignField: '_id',
          as: 'chatRoomInfo.userProfile'
        }
      },
      { $unwind: '$chatRoomInfo.userProfile' },
      // group data
      {
        $group: {
          _id: '$chatRoomInfo._id',
          postId: { $last: '$_id' },
          chatRoomId: { $last: '$chatRoomInfo._id' },
          message: { $last: '$message' },
          type: { $last: '$type' },
          postedByUser: { $last: '$postedByUser' },
          readByRecipients: { $last: '$readByRecipients' },
          chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
          createdAt: { $last: '$createdAt' },
          updatedAt: { $last: '$updatedAt' }
        }
      }
    ])
    .exec();

  return aggregate[0];
}

/**
 *
 * @param {*} chatRoomId
 * @param {*} currentUserOnlineId
 * @returns
 */
async function markMessageAsRead(chatRoomId, currentUserOnlineId) {
  return chatMessageModel.updateMany(
    {
      chatRoomId,
      'readByRecipients.readByUserId': {
        $ne: currentUserOnlineId
      }
    },
    {
      $addToSet: {
        readByRecipients: {
          readByUserId: currentUserOnlineId
        }
      }
    },
    {
      multi: true
    }
  );
}

/**
 *
 * @param {*} chatRoomId
 * @param {*} page
 * @param {*} limit
 * @returns
 */
async function findMessagesByRoomId(chatRoomId, page = 1, limit = 20) {
  const messages = await chatMessageModel
    .find({ chatRoomId })
    .limit(limit)
    .skip(limit * (page - 1))
    .exec();

  return messages ? messages : [];
}

async function getRecentConversation(chatRoomIds, options) {
  return chatMessageModel.aggregate([
    { $match: { chatRoomId: { $in: chatRoomIds } } },
    {
      $group: {
        _id: '$chatRoomId',
        messageId: { $last: '$_id' },
        chatRoomId: { $last: '$chatRoomId' },
        message: { $last: '$message' },
        type: { $last: '$type' },
        postedByUser: { $last: '$postedByUser' },
        createdAt: { $last: '$createdAt' },
        readByRecipients: { $last: '$readByRecipients' }
      }
    },
    { $sort: { createdAt: -1 } },
    // do a join on another table called users, and
    // get me a user whose _id = postedByUser
    {
      $lookup: {
        from: 'users',
        localField: 'postedByUser',
        foreignField: '_id',
        as: 'postedByUser'
      }
    },
    { $unwind: '$postedByUser' },
    // do a join on another table called chatrooms, and
    // get me room details
    {
      $lookup: {
        from: 'chatrooms',
        localField: '_id',
        foreignField: '_id',
        as: 'roomInfo'
      }
    },
    { $unwind: '$roomInfo' },
    { $unwind: '$roomInfo.userIds' },
    // do a join on another table called users
    {
      $lookup: {
        from: 'users',
        localField: 'roomInfo.userIds',
        foreignField: '_id',
        as: 'roomInfo.userProfile'
      }
    },
    { $unwind: '$readByRecipients' },
    // do a join on another table called users
    {
      $lookup: {
        from: 'users',
        localField: 'readByRecipients.readByUserId',
        foreignField: '_id',
        as: 'readByRecipients.readByUser'
      }
    },

    {
      $group: {
        _id: '$roomInfo._id',
        messageId: { $last: '$messageId' },
        chatRoomId: { $last: '$chatRoomId' },
        message: { $last: '$message' },
        type: { $last: '$type' },
        postedByUser: { $last: '$postedByUser' },
        readByRecipients: { $addToSet: '$readByRecipients' },
        roomInfo: { $addToSet: '$roomInfo.userProfile' },
        createdAt: { $last: '$createdAt' }
      }
    },
    // apply pagination
    { $skip: options.page * options.limit },
    { $limit: options.limit }
  ]);
}

export default {
  createPostInChatRoom,
  markMessageAsRead,
  findMessagesByRoomId,
  getRecentConversation
};
