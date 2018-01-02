const path = require('path');
const express = require('express');
// important for socket.io
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath))

//io.on lets you register an event listener
io.on('connection', (socket) => {
  console.log('new user connected');

  // socket.emit from Admin
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
  // socket.broadcast.emit from Admin text: New User Joined.
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

// listening to event on clients side.
// socket.emit emits and event to a single connection
// io.emit emits and event to every connection.
  socket.on('createMessage', (message, callback) =>{
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    // this callback is being passed to the socket.emit on createMessage as 'data' placeholder.
    // callback('This is from the server');
    callback(); 
  });

  // listens to creatLocationMessage
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })

  socket.on('disconnect', () => {
    console.log('disconnected from server')
  });
});

server.listen(port, () => {
  console.log(`Started on ${port}`);
});

module.exports = {app};

//emitting an event to server side.
  // socket.emit('newMessage', {
  //   from: 'terry',
  //   text: 'this is me messaging you',
  //   createdAt: 1234
  // })

  // socket.emit('newEmail', {
  //   from: "terry@mail.com",
  //   text: 'Hey, what is up?',
  //   createdAt: 123
  // })

// response from client to server - refer to index.js
  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail)
  // })
