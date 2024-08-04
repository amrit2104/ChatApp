const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`chat server on port ${PORT}`))

// initiating web server with socket.io
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname,'')))

let socketsConnected = new Set()

// listening to an event on the web socket server that is connection event
io.on('connection', onConnected)

// Let's increase the number of clients now
function onConnected(socket) {
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)
// removing a socket if a client closes connection.
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        console.log(data)
        socket.broadcast.emit('feedback', data)
    })
}