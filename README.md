# A simple live chat application using Sockets.io.

## Step 1
Firstly, had to set up the server.

- installed socketIO
- installed express

Also required the constants path and http

## Step 2

Set up public folders holding index.html as well as the JS files.

After setting up the server, we went to localhost:3000/socket.io/socket.io.js

This was then added as a script tag to the index.html file.

## Step 3 - Listening to and emitting events.
We have two files, 1) server.js and 2) index.js

Events work where a function emits an event and a function listens for the event.

On the server.js we emitted an event

```js
// emitting an event to server side.
  socket.emit('newMessage', {
    from: 'terry',
    text: 'this is me messaging you',
    createdAt: 1234
  })

```
This was listened to on the client side, on index.js

```js

// custom events.
socket.on('newEmail', function (email) {
  console.log('New email', email);
})

```
In the browsers console, the object would show, with the from, text and createdAt properties.

This could also be done for the client side.

In index.js we had the following

```js

//emitting event to server side
socket.emit('createMessage', {
  from: 'john@mail.com',
  text: 'Hi mr server.'
  })
});

```
On the server.js file we were listening for the event
```js
socket.on('createMessage', (message) =>{
  console.log('createMessage', message);
})
```
As you can see the patterns are identical.


## Step 4 - Broadcasting

Broadcasting is important as this will broadcast the event, which means that the event will be broadcast to everyone else but the the current user.

In the code below, on the socket.broadcast.emit function, when someone signs in, everyone in the chat room will see that 'New User has joined the Chat.'

This is different to io.emit which shares the event with everyone.

```js
//io.on lets you register an event listener
io.on('connection', (socket) => {
  console.log('new user connected');

  // socket.emit from Admin
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the Chat App',
    createdAt: new Date().getTime()
  })
  // socket.broadcast.emit from Admin text: New User Joined.
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New User has joined the chat room',
    createdAt: new Date().getTime()
  })
// listening to event on clients side.
// socket.emit emits and event to a single connection
// io.emit emits and event to every connection.
  socket.on('createMessage', (message) =>{
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })

    socket.on('disconnect', () => {
      console.log('disconnected from server')
    });
  });

  server.listen(port, () => {
    console.log('Started on port');
  });
```

## Step 5 - Event Acknowledgements

Acknowledgements will allow the request listener to send something back to the request emitter.

Firstly, we created a new method called generateMessage. This was so we do not have to repeat the from, text and createdAt object.

In the server folder we created a Utils folder and then a message.js file.

Within the message.js folder we created the generateMessage method.

```js
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  }
};

module.exports = {generateMessage}
```

This was then added to the server.js file where we had all the from, text and createdAt. Below is an example for the 'createMessage' event listener.

```js
socket.on('createMessage', (message, callback) =>{
  console.log('createMessage', message);
  io.emit('newMessage', generateMessage(message.from, message.text));
  // this callback is being passed to the socket.emit on createMessage as 'data' placeholder.
  callback('This is from the server');
});
```

An interesting thing here is that we are now acknowledging the event by creating that third arguement called 'callback'

This is being passed to the socket.emit on createMessage in the index.js file.

```js
socket.emit('createMessage', {
  from: 'Syaf',
  text: "hi"
}, function(data) {
  console.log('Got it!', data)
})
```
The callback is being passed as 'data' and we will get the log, 'Got it! This is from the server'
