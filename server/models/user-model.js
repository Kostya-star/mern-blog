import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  avatarUrl: String,
  postsCreated: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
})

export default mongoose.model('User', UserSchema)
