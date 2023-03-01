import CommentModel from "../models/comments-model.js"

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

    res.json(comment)

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
  createComment
}

// const createPost = async (req, res) => {
//   try {
//     const { title, text, tags, imageUrl } = req.body

//     const post = new PostModel({
//       title,
//       text,
//       tags,
//       user: req.body.userId,
//       imageUrl
//     })

//     await post.save()

//     res.json(post)

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: 'Error when creating the post'
//     })
//   }
// }