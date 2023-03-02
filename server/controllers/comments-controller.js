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

    await comment.save()

    PostModel.findOneAndUpdate({
      _id: postId
    },
      {
        $inc: { commentCount: 1 }
      },
      {
        returnDocument: 'after'
      },
      async (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Error when creating the comment'
          })
        }

        if (!doc) {
          console.log(error);
          return res.status(404).json({
            message: 'The post is not found'
          })
        }
        await comment.populate('user')
        await doc.populate('user')
        res.json({ comment, updatedPost: doc })
      },
    )


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

    console.log(id, text);
    await CommentModel.updateOne({
      _id: id
    },
    {
      text
    })

    res.json({
      success: true
    })

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

    PostModel.findByIdAndUpdate({
      _id: comment.post
    },
      {
        $inc: { commentCount: -1 }
      },
      {
        returnDocument: 'after'
      },
      async (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Error when creating the comment'
          })
        }

        if (!doc) {
          console.log(error);
          return res.status(404).json({
            message: 'The post is not found'
          })
        }
        await doc.populate('user')
        res.json({id: comment._id, updatedPost: doc})
      }
    )

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