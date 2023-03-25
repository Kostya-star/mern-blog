import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: function() {
      !this.imageUrl
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  usersLiked: {
    type: Array,
    default: []
  },
  imageUrl: {
    type: String,
    required: function() {
      !this.text
    },
  },
}, {
  timestamps: true
})

export default mongoose.model('Comment', CommentSchema)
