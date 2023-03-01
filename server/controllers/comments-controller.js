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

// const getOnePost = async (req, res) => {
//   try {
//     const { id } = req.params

//     PostModel.findOneAndUpdate({
//       _id: id
//     },
//       {
//         $inc: { viewCount: 1 }
//       },
//       {
//         returnDocument: 'after'
//       },
//       (error, doc) => {
//         if (error) {
//           console.log(error);
//           return res.status(500).json({
//             message: 'Error when fetching the post'
//           })
//         }

//         if (!doc) {
//           console.log(error);
//           return res.status(404).json({
//             message: 'The post is not found'
//           })
//         }
//         res.json(doc)
//       }
//     ).populate('user')

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: 'Error when fetching the post'
//     })
//   }
// }

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
      (error, doc) => {
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
        // res.json(doc)
        res.json({comment, updatedPost: doc})
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
