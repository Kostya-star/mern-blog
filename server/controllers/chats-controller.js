import ChatModel from "../models/chat-model.js";
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


export default {
  accessChat,
  getAllChats
}