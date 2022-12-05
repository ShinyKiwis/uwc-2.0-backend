const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

// Allow CORS
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
})

const PORT = 4000
const activeList = []
const nameList = []
const socketList = []


io.on('connection', (socket) => {
  console.log('User connected: ', socket.id)
  console.log('There is ' + activeList.length +' connections')
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected!', socket.id)
  })
  // Handle get activeList
  socket.on('getList', () => {
    socket.emit('returnList', activeList)
  })

  //Handle add username with activeList
  socket.on('sendUsername', (username) => {
    if(!nameList.includes(username)){
      activeList.push(`${username}-${socket.id}`)
      nameList.push(username)
    }
  })

  socket.on('privateChat', (data)=>{
    const {username, to, message} = data
    socket.to(to).emit("privateMessage", {
      message: `[${username}]: ${message}`
    })
  })
})

server.listen(PORT, ()=> {
  console.log(`Server is listening on port ${PORT}`)
})
