const path = require('path');
const express = require('express');
// important for socket.io
const http = require('http');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath))

//io.on lets you register an event listener
io.on('connection', (socket) => {
  console.log('new user connected');

// listening to event on clients side.
  socket.on('createMessage', (message) =>{
    console.log('createMessage', message)
  })
//emitting an event to server side.
  socket.emit('newMessage', {
    from: 'terry',
    message: 'this is me messaging you',
    createdAt: 1234
  })


  socket.on('disconnect', () => {
    console.log('disconnected from server')
  });
});



server.listen(port, () => {
  console.log(`Started on ${port}`);
});

module.exports = {app};

  // socket.emit('newEmail', {
  //   from: "terry@mail.com",
  //   text: 'Hey, what is up?',
  //   createdAt: 123
  // })

// response from client to server - refer to index.js
  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail)
  // })