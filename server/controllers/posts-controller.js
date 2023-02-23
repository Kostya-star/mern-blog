import PostModel from "../models/post-model.js"

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

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

    PostModel.findOneAndUpdate({
      _id: id
    },
      {
        $inc: { viewCount: 1 }
      },
      {
        returnDocument: 'after'
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Error when fetching the post'
          })
        }

        if (!doc) {
          console.log(error);
          return res.status(404).json({
            message: 'The post is not found'
          })
        }
        res.json(doc)
      }
    )

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when fetching the post'
    })
  }
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
    console.log(error);
    res.status(500).json({
      message: 'Error when creating the post'
    })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await PostModel.findById(id)

    if(!post) {
      return res.status(404).json({
        message: 'The post is not found'
      })
    }

    await post.delete()
    
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

const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, text, tags, user, imageUrl } = req.body

    await PostModel.updateOne({
      _id: id
    },
      {
        title,
        text,
        tags,
        user,
        imageUrl
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

export default {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost
}