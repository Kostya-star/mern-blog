import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)


server.listen(5001, () => {
  console.log('Socket io server is running on port 5001');
})