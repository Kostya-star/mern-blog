import express from 'express'
import mongoose from 'mongoose'
import authRouters from './routes/auth-routes.js'

const app = express()

app.use(express.json())

app.use('/auth', authRouters)

const PORT = 5000

mongoose.set('strictQuery', false)

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://Constantin:test123@blog.qheeral.mongodb.net/blog?retryWrites=true&w=majority')
    app.listen(PORT, () => console.log(`Server started on PORT${PORT}`))
  } catch (error) {
    console.log(error);
  }
}

start()