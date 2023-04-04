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
import chatsRouters from './routes/chats-routes.js'
import cors from 'cors';
import http from 'http'
import { Server } from 'socket.io'


const app = express();
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(express.json())

const multerMid = multer({
  storage: multer.memoryStorage(),
});

app.use('/auth', authRouters)
app.use('/posts', postsRouters)
app.use('/comments', commentsRouters)
app.use('/profile', profileRouters)
app.use('/chats', chatsRouters)
app.use('/tags', tagsRouters)
app.use('/upload', multerMid.single('file'), imageRoutes)

const PORT = process.env.PORT || 5000

mongoose.set('strictQuery', false)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    server.listen(PORT, () => console.log(`Server started on PORT${PORT}`))
  } catch (error) {
    console.log(error);
  }
}

start()

// SOCKETS

io.on('connection', (socket) => {
  console.log('a user is connected', socket.id)

  socket.on('newComment', (comment) => {
    io.emit('newComment', comment)
    // socket.broadcast.emit('newComment', comment);
  })

  socket.on('updateComment', (comment) => {
    io.emit('updateComment', comment)
  })

  socket.on('likeComment', (resp) => {
    io.emit('likeComment', resp)
  })

  socket.on('deleteComment', (commId) => {
    io.emit('deleteComment', commId)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  })
})
