import bcrypt from 'bcrypt';
import UserModel from '../models/user-model.js';
import PostModel from '../models/post-model.js';
import CommentModel from '../models/comments-model.js';
import tokenService from '../services/token-service.js';
import { getBase64 } from '../utils/getBase64.js';

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body
    const image = req.file

    const userDb = await UserModel.findOne({ email })

    if (userDb) {
      return res.status(400).json({
        message: 'This email is already registered'
      })
      // throw new Error('the user already exists')
    }

    const hashedPass = await bcrypt.hash(password, 5)

    let avatarUrl = ''

    if (image) {
      avatarUrl = getBase64(image)
    }

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

const getUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findById(id)

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
      message: 'Error occured when updating a user'
    })
  }
}

const updateMe = async (req, res) => {
  try {
    const { userId, fullName, email, password } = req.body
    const image = req.file

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

    let avatarUrl = ''

    if (image) {
      avatarUrl = getBase64(image)
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        fullName,
        email,
        hashedPassword: hashedPass || user.hashedPassword,
        avatarUrl: avatarUrl || ''
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

    await user.delete()

    await PostModel.deleteMany({ user: userId })
    await CommentModel.deleteMany({ user: userId })

    await PostModel.updateMany({ usersLiked: userId }, { $pull: { usersLiked: userId } })
    await PostModel.updateMany({ usersCommented: userId }, { $pull: { usersCommented: userId } })
    await CommentModel.updateMany({ usersLiked: userId }, { $pull: { usersLiked: userId } })

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

const follow_unfollow = async (req, res) => {
  try {
    const followingUserId = req.body.userId
    const followedUserId = req.body.followedUserId

    const followingUser = await UserModel.findById(followingUserId)
    const followedUser = await UserModel.findById(followedUserId)

    if (!followedUser) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    const isFollowed = followedUser.usersFollowed.includes(followingUser._id)

    if (isFollowed) {
      await followedUser.updateOne({ $pull: { 'usersFollowed': followingUser._id } })
      await followingUser.updateOne({ $pull: { 'usersFollowing': followedUser._id } })
      res.json({ isFollowed: false, followingUserId, followedUserId });
    } else {
      await followedUser.updateOne({ $push: { 'usersFollowed': followingUser._id } })
      await followingUser.updateOne({ $push: { 'usersFollowing': followedUser._id } })
      res.json({ isFollowed: true, followingUserId, followedUserId });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error occured when following a user'
    })
  }
}

const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    const followedUsers = await UserModel.find({ _id: { $in: user.usersFollowed } })

    res.json(followedUsers)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occured when getting user's followers"
    })
  }
}

export default {
  register,
  login,
  getMe,
  getUser,
  updateMe,
  deleteMe,
  follow_unfollow,
  getUserFollowers
}