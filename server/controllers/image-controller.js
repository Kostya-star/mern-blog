import PostModel from '../models/post-model.js'
import fs from 'fs'

const uploadImage = async (req, res) => {
  try {
    // const buffer = {
    //   data: fs.readFileSync(req.file.path),
    //   contentType: req.file.mimetype
    // }
    
    // const base64Image = Buffer.from(buffer.data).toString('base64');
    // const imageUrl = `data:${buffer.contentType};base64,${base64Image}`;

    // const user = new PostModel({
    //     title: 'testtt',
    //     text: 'testtt',
    //     tags: 'testtt',
    //     user: '640236b2eb37e3f7d885ce12',
    //     imageUrl
    //   })

    //   const base64Image = Buffer.from(user.imageUrl.data).toString('base64');
    //   const imageUrl = `data:${user.imageUrl.contentType};base64,${base64Image}`;

    await user.save()
    res.json({
      user
    })

    // res.json({
    //   url: `/uploads/${req.file.originalname}`
    // })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error when uploading the image'
    })
  }
}

export default {
  uploadImage
}