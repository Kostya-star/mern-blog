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
    type: Array,
    default: []
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
  usersLiked: {
    type: Array,
    default: [],
  },
}, {
  timestamps: true
})

export default mongoose.model('Post', PostSchema)
