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
    const { userId } = req.body

    const comment = await CommentModel.findById(id)

    await PostModel.findByIdAndUpdate(
      { _id: comment.post },
      { $pull: { 'usersCommented': userId } },
      { new: true }
      )
      
    await comment.delete()

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
    
    if(!comment) {
      return res.status(404).json({
        message: 'The comment is not found'
      })
    }

    const isLiked = comment.usersLiked.includes(userId)
    
    if(isLiked) {
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