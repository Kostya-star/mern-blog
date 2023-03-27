import CommentModel from "../models/comments-model.js"
import PostModel from '../models/post-model.js'
import { getBase64 } from "../utils/getBase64.js"
import { uploadImageGoogleCloud } from "../utils/uploadImageGoogleCloud.js"

const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().limit(5).populate('user')

    res.json(comments)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when fetching the comments'
    })
  }
}

const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params

    const commentsParams = {}
    if (postId) {
      commentsParams.post = postId
    }
    const comments = await CommentModel.find(commentsParams).populate('user')

    res.json(comments)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when fetching the comments'
    })
  }
}

const createComment = async (req, res) => {
  try {
    const { postId, text, userId } = req.body
    const image = req.file

    if (!text && !image) {
      return res.status(400).json({
        message: 'Text or image are required'
      })
    }

    let imageUrl = ''

    if(image) {
      imageUrl = await uploadImageGoogleCloud(image)
    }

    const comment = new CommentModel({
      text: text || '',
      user: userId,
      post: postId,
      imageUrl: imageUrl
    })

    await PostModel.findByIdAndUpdate(
      { _id: postId },
      { $push: { 'usersCommented': userId } },
      { new: true }
    )

    await comment.save()
    await comment.populate('user')

    res.json(comment)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when creating the comment'
    })
  }
}

const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    const { text } = req.body
    const image = req.file

    if (!text && !image) {
      return res.status(400).json({
        message: 'Text or image are required'
      })
    }

    const comment = await CommentModel.findByIdAndUpdate(
      { _id: id },
      {
        text,
        imageUrl: image ? getBase64(image) : ''
      },
      { new: true }
    )

    await comment.populate('user')
    res.json(comment)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when updating the comment'
    })
  }
}

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    const comment = await CommentModel.findById(id)

    const post = await PostModel.findById(comment.post);

    const index = post.usersCommented.findIndex((user) => user.toString() === userId.toString());
    
    await comment.delete()

    if (index !== -1) {
      post.usersCommented.splice(index, 1);
      await post.save();
    }

    res.json({ id, postId: comment.post, userId: comment.user })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when creating the comment'
    })
  }
}

const likeComment = async (req, res) => {
  try {
    const { commId, userId } = req.body

    const comment = await CommentModel.findById(commId)

    if (!comment) {
      return res.status(404).json({
        message: 'The comment is not found'
      })
    }

    const isLiked = comment.usersLiked.includes(userId)

    if (isLiked) {
      await comment.updateOne({ $pull: { 'usersLiked': userId } })
      res.json({ isLiked: false, commId, userId });
    } else {
      await comment.updateOne({ $push: { 'usersLiked': userId } })
      res.json({ isLiked: true, commId, userId });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when liking the comment'
    })
  }
}

export default {
  getComments,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
  likeComment
}