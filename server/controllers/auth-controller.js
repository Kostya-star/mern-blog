import bcrypt from 'bcrypt';
import UserModel from '../models/user-model.js';
import PostModel from '../models/post-model.js';
import CommentModel from '../models/comments-model.js';
import tokenService from '../services/token-service.js';
import { getBase64 } from '../utils/getBase64.js';

const register = async (req, res) => {
  try {
    const { fullName, email, password, avatarUrl } = req.body
    
    const userDb = await UserModel.findOne({ email })

    if (userDb) {
      return res.status(400).json({
        message: 'This email is already registered'
      })
    }

    const hashedPass = await bcrypt.hash(password, 5)

    const user = new UserModel({
      fullName,
      email,
      hashedPassword: hashedPass,
      avatarUrl
    })

    await user.save()

    const token = tokenService.generateToken({ _id: user._id })

    const { hashedPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when registering'
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    const isPassValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isPassValid) {
      return res.status(400).json({
        message: 'Wrong login or password'
      })
    }

    const token = tokenService.generateToken({ _id: user._id })

    const { hashedPassword, ...userData } = user._doc

    res.json({
      ...userData,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when logging in'
    })
  }
}

const getMe = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    const { hashedPassword, ...userData } = user._doc

    res.json(userData)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when fetching a user'
    })
  }
}

const updateMe = async (req, res) => {
  try {
    const { userId, fullName, email, password, avatarUrl } = req.body

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.json({
        message: 'The user is not found'
      })
    }

    let hashedPass = ''

    if (password) {
      hashedPass = await bcrypt.hash(password, 5)
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        fullName,
        email,
        hashedPassword: hashedPass || user.hashedPassword,
        avatarUrl
      },
      { new: true }
    )

    res.json(updatedUser)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when updating a user'
    })
  }
}

const deleteMe = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.json({
        message: 'The user is not found'
      })
    }

    await UserModel.updateMany({ usersFollowed: userId }, { $pull: { usersFollowed: userId } })
    await UserModel.updateMany({ usersFollowing: userId }, { $pull: { usersFollowing: userId } })

    await PostModel.deleteMany({ user: userId })
    await CommentModel.deleteMany({ user: userId })

    await PostModel.updateMany({ usersLiked: userId }, { $pull: { usersLiked: userId } })
    await PostModel.updateMany({ usersCommented: userId }, { $pull: { usersCommented: userId } })
    await CommentModel.updateMany({ usersLiked: userId }, { $pull: { usersLiked: userId } })

    await user.delete()

    res.json({
      success: true
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when updating a user'
    })
  }
}

export default {
  register,
  login,
  getMe,
  updateMe,
  deleteMe,
}