import dotenv from'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRouters from './routes/auth-routes.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use('/auth', authRouters)

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