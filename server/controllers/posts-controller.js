import PostModel from "../models/post-model.js"
import fs from 'fs'

const getAllPosts = async (req, res) => {
  try {
    const sortProperty = req.query.sortBy;
    const tagProperty = req.query.tag;

    let tag = {};
    if (tagProperty) {
      tag.tags ={$all: [tagProperty]}
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
    ).populate('user')

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when fetching the post'
    })
  }
}

const createPost = async (req, res) => {
  try {
    const { title, text, tags, userId } = req.body
    const image = req.file
    let imageUrl = ''

    if(image) {
      const buffer = {
        data: fs.readFileSync(image.path),
        contentType: image.mimetype
      }
      const base64Image = Buffer.from(buffer.data).toString('base64');
      imageUrl = `data:${buffer.contentType};base64,${base64Image}`;
    }
    
    const post = new PostModel({
      title,
      text,
      tags: tags.split(' '),
      user: userId,
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

const updatePost = async (req, res) => {
  try {
    const { title, text, tags, postId, userId } = req.body
    const image = req.file

    let imageUrl = ''

    if(image) {
      const buffer = {
        data: fs.readFileSync(image.path),
        contentType: image.mimetype
      }
      const base64Image = Buffer.from(buffer.data).toString('base64');
      imageUrl = `data:${buffer.contentType};base64,${base64Image}`;
    }

    await PostModel.updateOne({
      _id: postId
    },
      {
        title,
        text,
        tags: tags.split(' '),
        user: userId,
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


export default {
  createPost,
  getAllPosts,
  getOnePost,
  deletePost,
  updatePost
}