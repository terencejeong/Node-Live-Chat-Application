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


## Step 4 Broadcasting
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

- Is the message data valid? 
