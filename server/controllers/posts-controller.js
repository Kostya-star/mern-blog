import PostModel from "../models/post-model.js"
import { getBase64 } from './../utils/getBase64.js';
import CommentModel from '../models/comments-model.js'
import UserModel from "../models/user-model.js";
import { uploadImageGoogleCloud } from "../utils/uploadImageGoogleCloud.js";

const getAllPosts = async (req, res) => {
  try {
    const sortProperty = req.query.sortBy;
    const tagProperty = req.query.tag;

    let tag = {};
    if (tagProperty) {
      tag.tags = { $all: [tagProperty] }
    }

    const posts = await PostModel.find(tag).sort({ [sortProperty]: -1 }).populate('user').exec()

    res.json(posts)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when fetching all posts'
    })
  }
}

const getOnePost = async (req, res) => {
  try {
    const { id } = req.params
    const isPostView = req.query.isPostView === 'true'

    if (isPostView) {
      await PostModel.findByIdAndUpdate(
        { _id: id },
        { $inc: { viewCount: 1 } },
        { new: true }
      )
    }

    const post = await PostModel.findById(id).populate('user').exec()

    if (!post) {
      return res.status(404).json({
        message: 'The post is not found'
      })
    }
    res.json(post)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when fetching the post'
    })
  }
}

const createPost = async (req, res) => {
  try {
    const { title, text, tags, userId, fileUrl } = req.body
    const image = req.file

    const post = new PostModel({
      title,
      text,
      tags: tags.split(' '),
      user: userId,
      imageUrl: fileUrl,
    })

    await post.save()

    await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { postsCreated: 1 } },
      { new: true }
    )

    res.json(post)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when creating the post'
    })
  }
}

const updatePost = async (req, res) => {
  try {
    const { title, text, tags, userId, fileUrl } = req.body

    const { postId } = req.params

    const post = await PostModel.findById(postId)

    if(!post) {
      return res.json({
        message: 'The post is not found'
      })
    }

    await PostModel.updateOne({
      _id: postId
    },
      {
        title,
        text,
        tags: tags.split(' '),
        user: userId,
        imageUrl: fileUrl
      })

    res.json({
      success: true
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when updating the post'
    })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    const post = await PostModel.findById(id)

    if (!post) {
      return res.status(404).json({
        message: 'The post is not found'
      })
    }

    await post.delete()
    await CommentModel.deleteMany({ post: post._id })

    await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { postsCreated: -1 } },
      { new: true }
    )

    res.json({
      success: true
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when deleting the post'
    })
  }
}

const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'The post is not found'
      })
    }

    const isLiked = post.usersLiked.includes(userId)

    if (isLiked) {
      await post.updateOne({ $pull: { 'usersLiked': userId } })
      res.json({ isLiked: false, userId, postId: post._id });
    } else {
      await post.updateOne({ $push: { 'usersLiked': userId } })
      res.json({ isLiked: true, userId, postId: post._id });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when liking the post'
    })
  }
}

export const getPostsByUserId = async(req, res) => {
  try {
    const { id } = req.params
    
    const posts = await PostModel.find({ user: id }).populate('user')
    
    res.json(posts)

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when liking the post'
    })
  }
}


export default {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost,
  likePost,
  getPostsByUserId
}