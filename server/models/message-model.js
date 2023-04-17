import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: {
    type: Boolean,
    default: true,
    required: true
  },
  text: {
    type: String,
    required: function () {
      !this.imageUrl
    },
  },
  imageUrl: {
    type: String,
    required: function () {
      !this.text
    },
  },
  isLiked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model('Message', MessageSchema)
