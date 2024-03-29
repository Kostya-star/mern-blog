import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    // required: true,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String,
  usersCommented: {
    type: Array,
    default: [],
  },
  usersLiked: {
    type: Array,
    default: [],
  },
}, {
  timestamps: true
})

export default mongoose.model('Post', PostSchema)
