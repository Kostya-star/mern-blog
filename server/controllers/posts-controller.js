import PostModel from "../models/post-model.js"

const createPost = async (req, res) => {
  try {
    const { title, text, tags, imageUrl } = req.body
console.log(req.body);
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
    console.log(error);
    res.status(500).json({
      message: 'Error when creating the article'
    })
  }
}

export default {
  createPost,
  // getOnePost
}