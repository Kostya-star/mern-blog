import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    // unique: true
  },
  tags: {
    type: Array,
    default: []
  },
  viewCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
  likes: {
    usersLiked: {
      type: [String],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true
})

export default mongoose.model('Post', PostSchema)
