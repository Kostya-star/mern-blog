import CommentModel from "../models/comments-model.js"

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
  createComment,
}

const createPost = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body

    const post = new PostModel({
      title,
      text,
      tags,
      user: req.body.userId,
      imageUrl
    })

    await post.save()

    res.json(post)

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error when creating the post'
    })
  }
}
