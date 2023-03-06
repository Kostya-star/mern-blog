import CommentModel from "../models/comments-model.js"
import PostModel from '../models/post-model.js'

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

    const comment = new CommentModel({
      text,
      user: userId,
      post: postId
    })

    await PostModel.findByIdAndUpdate(
      { _id: postId },
      { $inc: { commentCount: 1 } },
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

    const comment = await CommentModel.findByIdAndUpdate(
      { _id: id },
      { text },
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

    const comment = await CommentModel.findById(id)

    if (!comment) {
      return res.status(404).json({
        message: 'The comment is not found'
      })
    }

    await comment.delete()

    await PostModel.findByIdAndUpdate(
      { _id: postId },
      { $inc: { commentCount: 1 } },
      { new: true }
    )

    res.json({ id: comment._id })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when creating the comment'
    })
  }
}

export default {
  getComments,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
}