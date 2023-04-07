import dotenv from 'dotenv'
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
  // pingTimeout: 60000,
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

const onlineUsers = []
console.log(onlineUsers);

io.on('connection', (socket) => {
  console.log('user is connected', socket.id)

  // online users & private messages logic
  socket.on('add new user', (userId) => { // add new online user if they just signed in
    !onlineUsers.some(user => user?.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id
      })
      io.emit('getOnlineUsers', onlineUsers)
    })
    
    socket.on('send message', ({createdMessage, recipientId}) => {
      const recipient = onlineUsers.find(user => user?.userId === recipientId)
      
      if(recipient) {
        // console.log('recipient.socketId', recipient.socketId);
        // console.log(onlineUsers);
        // io.to(recipient.socketId).emit('receive message', createdMessage)
        io.to(recipient.socketId).emit('receive message', createdMessage)
      }
    })
    
    
    
    socket.on('newComment', (comment) => {
      io.emit('newComment', comment)
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
      const disconnectedUserInd = onlineUsers.findIndex(user => user?.socketId === socket.id);
      if (disconnectedUserInd !== -1) {
        onlineUsers.splice(disconnectedUserInd, 1)
      }
      io.emit('getOnlineUsers', onlineUsers)
  })
})


  // socket.on('send message', (newMessage) => {
  //   newMessage.chat.participants.forEach(userId => {
  //     socket.to(userId).emit('receive message', newMessage)
  //   })
  // })

  // socket.on('setup', (currentUserId) => {
  //   socket.join(currentUserId)
  //   socket.emit('connected')
  // })

  // // the room for the two users in one-on-one chat
  // socket.on('join chat', (roomId) => {
  //   socket.join(roomId)
  //   console.log('User joined room' + ' ' + roomId);
  // })

  // socket.on('send message', (newMessage) => {
  //   const chat = newMessage.chat

  //   if(!chat.participants.length) {
  //     return console.log('chat.participants not defined');
  //   } 

  //   chat.participants.forEach(userId => {
  //     if(userId === newMessage.sender._id) return

  //     io.to(userId).emit('receive message', newMessage)
  //   })
  // })
