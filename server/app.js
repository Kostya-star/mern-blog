import dotenv from'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRouters from './routes/auth-routes.js'
import postsRouters from './routes/posts-routes.js'
import multer from 'multer'
import imageRoutes from './routes/image-routes.js'
import { imageStorageCreator } from './utils/imageStorageCreator.js'

dotenv.config()

const app = express()

app.use(express.json())


export const upload = multer(imageStorageCreator(multer)) // multer({ storage })

app.use('/auth', authRouters)
app.use('/posts', postsRouters)
app.use('/uploads', upload.single('image'), imageRoutes)
app.use('/uploads', express.static('uploads'))

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