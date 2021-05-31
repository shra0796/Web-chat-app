const express = require('express')
const https = require('https')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { genarateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = https.createServer(app)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const server = app.listen(port, () => {
    console.log('serve is up on port '+port)
})

const io = socketio(server)
//let count = 0

io.on('connection', (socket) => {
    console.log('New wesocket connection!')

    socket.on('join', (options, callback) => { 
        const { error, user } = addUser({ id: socket.id, ...options })

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', genarateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', genarateMessage('Admin', ' '+user.username+' has joined!'))
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        })
    
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        // if(filter.isProfane(message)){
        //     return callback('Profanity is not allowed!')
        // }
    
        io.to(user.room).emit('message', genarateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', genarateMessage('Admin', ' '+user.username+' has left'))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }
    })
})


// socket.emit('countUpdated', count)

    // socket.on('increment', () => {
    //     count++
    //     //socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)
    // })