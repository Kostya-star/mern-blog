import ChatModel from "../models/chat-model.js";
import MessageModel from "../models/message-model.js";
import UserModel from "../models/user-model.js";

const accessChat = async (req, res) => {
  try {
    const authorizedUserId = req.body.userId
    const { interlocutorId } = req.params

    let chat = await ChatModel.findOne({
      $and: [
        { participants: { $elemMatch: { $eq: authorizedUserId } } },
        { participants: { $elemMatch: { $eq: interlocutorId } } },
      ]
    }).populate('participants').populate('latestMessage') // add '-hashedPassword later'

    chat = await UserModel.populate(chat, {
      path: 'latestMessage.sender'
    })

    if (chat) {
      res.json(chat)
    } else {
      const createdChat = new ChatModel({
        participants: [authorizedUserId, interlocutorId]
        // latestMessage
      })

      await createdChat.save();

      await createdChat.populate('participants')
      res.json(createdChat)
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when fetching the chat'
    })
  }
}

const getAllChats = async (req, res) => {
  try {
    const { userId } = req.body

    let chats = await ChatModel.find({ participants: { $elemMatch: { $eq: userId } } })
      .populate('participants')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })

    chats = await UserModel.populate(chats, {
      path: 'latestMessage.sender'
    })

    res.json(chats)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when fetching all chats'
    })
  }
}

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params

    if (!chatId) {
      return res.status(400).json({
        message: 'No chat id'
      })
    }

    const messages = await MessageModel.find({ chat: chatId })
      .populate({
        path: 'chat',
        populate: {
          path: 'latestMessage',
          populate: {
            path: 'sender',
            select: '-hashedPassword'
          }
        }
      })
      .populate('sender', '-hashedPassword');

    res.json(messages)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when fetching the messages'
    })
  }
}

const sendMessage = async (req, res) => {
  try {
    const { chat, text, imageUrl, userId } = req.body

    if (!text && !imageUrl) {
      return res.status(400).json({
        message: 'Message text or image is required'
      })
    }

    let message = new MessageModel({
      chat,
      sender: userId,
      text,
      imageUrl
    })

    await message.save()

    message = await MessageModel.findById(message._id)
      .populate([
        {
          path: 'sender',
          select: '-hashedPassword'
        },
        {
          path: 'chat',
          populate: {
            path: 'latestMessage',
            populate: {
              path: 'sender',
              select: '-hashedPassword'
            }
          }
        }
      ]);

    await ChatModel.findByIdAndUpdate(chat, {
      latestMessage: message._id,
    })

    res.json(message)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when sending the message'
    })
  }
}

const deleteEmptyChats = async (req, res) => {
  try {
    const { userId } = req.body

    const emptyChats = await ChatModel.aggregate([
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'chat',
          as: 'messages',
        },
      },
      {
        $match: {
          // 'participants': { $all: [userId] },
          'messages': { $size: 0 },
        },
      },
    ]);

    const chatIds = emptyChats.map((chat) => chat._id);

    await ChatModel.deleteMany({ 
      participants: userId,
      _id: { $in: chatIds } 
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when deleting empty chats'
    })
  }
}



export default {
  accessChat,
  getAllChats,
  sendMessage,
  getChatMessages,
  deleteEmptyChats
}