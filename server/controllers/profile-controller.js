import bcrypt from 'bcrypt';
import UserModel from '../models/user-model.js';
import PostModel from '../models/post-model.js';
import CommentModel from '../models/comments-model.js';
import tokenService from '../services/token-service.js';
import { getBase64 } from '../utils/getBase64.js';


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

const deleteUserFollower = async(req, res) => {
  try {
    const { userId } = req.body
    const { id } = req.params

    const user = await UserModel.findById(userId)
    const follower = await UserModel.findById(id)

    if(!follower) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    await user.updateOne({ $pull: { 'usersFollowed': follower._id } })
    await follower.updateOne({ $pull: { 'usersFollowing': user._id } })

    res.json({
      deletedFollower: follower._id
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occured when deleting user's follower"
    })
  }
}

const getUserFollowings = async(req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findById(id)

    if(!user) {
      return res.status(404).json({
        message: 'The user is not found'
      })
    }

    const userFollowings = await UserModel.find({ _id: { $in: user.usersFollowing } })

    res.json(userFollowings)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occured when getting user's followings"
    })
  }
}

export default {
  getUser,
  follow_unfollow,
  getUserFollowers,
  deleteUserFollower,
  getUserFollowings
}