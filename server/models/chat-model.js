import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
}, {
  timestamps: true
})

export default mongoose.model('Chat', ChatSchema)
