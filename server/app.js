import dotenv from'dotenv'
dotenv.config();
import express from 'express'
import mongoose from 'mongoose'
import authRouters from './routes/auth-routes.js'
import tagsRouters from './routes/tags-routes.js'
import postsRouters from './routes/posts-routes.js'
import commentsRouters from './routes/comments-routes.js'
import profileRouters from './routes/profile-routes.js'
import multer from 'multer'
import imageRoutes from './routes/image-routes.js'
import cors from 'cors';


const app = express();

app.use(express.json())
// app.use(express.urlencoded({ extended: false }));



const multerMid = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //   fileSize: 10 * 1024 * 1024, // 10 MB
  // },
  // fileFilter: (req, file, cb) => {
  //   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //     return cb(new Error('Only images are allowed.'), false)
  //   }
  //   if (file.size > 10 * 1024 * 1024) {
  //     return cb(new Error("File can't be larger than 10MB."), false)
  //   }
  //   cb(null, true)
  // }
})

app.use(cors())
app.use('/auth', authRouters)
app.use('/posts', postsRouters)
app.use('/comments', commentsRouters)
app.use('/profile', profileRouters)
app.use('/tags', tagsRouters)
app.use('/upload', multerMid.single('file'), imageRoutes)
// app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 5000

mongoose.set('strictQuery', false)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    app.listen(PORT, () => console.log(`Server started on PORT${PORT}`))
  } catch (error) {
    console.log(error);
  }
}

start()