const path = require('path');
const express = require('express');
// important for socket.io
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
// can now call our user methods.
var users = new Users();


app.use(express.static(publicPath))

//io.on lets you register an event listener
io.on('connection', (socket) => {
  console.log('new user connected');

  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));


  // for the chat room, join page. Will listen to the event emitted by chat.html
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.')
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    //socket.leave('the office fans')
    // ways to emit to specific rooms. io will go to everyone. broadcast will go to everyone but usual user.
    // io.emit -> io.to('the office fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('the office fans').emit

    // socket.emit from Admin
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
    // socket.broadcast.emit from Admin text: New User Joined.
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  })

// listening to event on clients side.
// socket.emit emits and event to a single connection
// io.emit emits and event to every connection.
  socket.on('createMessage', (message, callback) =>{
    var user = users.getUser(socket.id)
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    // this callback is being passed to the socket.emit on createMessage as 'data' placeholder.
    // callback('This is from the server');
    callback();
  });

  // listens to creatLocationMessage
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id)
    if (user) {
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    }
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat. `));
    }
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
