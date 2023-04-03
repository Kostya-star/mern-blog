// import http from 'http'
// import express from 'express'
// import { Server } from 'socket.io'
// import cors from 'cors'

// const app = express()
// app.use(cors())
// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// })

// io.on('connection', (socket) => {
//   console.log('a user is connected', socket.id)

//   socket.on('newComment', (comment) => {
//     io.emit('newComment', comment)
//     // socket.broadcast.emit('newComment', comment);
//   })

//   socket.on('updateComment', (comment) => {
//     io.emit('updateComment', comment)
//   })

//   socket.on('likeComment', (resp) => {
//     io.emit('likeComment', resp)
//   })

//   socket.on('deleteComment', (commId) => {
//     io.emit('deleteComment', commId)
//   })

//   socket.on('disconnect', () => {
//     console.log('user disconnected', socket.id);
//   })
// })


// server.listen(5001, () => {
//   console.log('Socket io server is running on port 5001');
// })