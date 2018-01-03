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

## Step 6 - Message Form and JQuery.

Added the form as well as the JQuery to the HTML Doc.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
  <p> the chat app </p>

  <ol id="messages">
  </ol>

  <form id="message-form">
    <input name="message" type="text" placeholder="Message"/>
    <button> Send </button>
  </form>

  <button id="send-location"> Send Location </button>

  <script src="/socket.io/socket.io.js"> </script>
  <script src="/js/libs/jquery-3.2.1.min.js"></script>
  <script src="/js/index.js"></script>
  </body>
</html>
```
Now, we needed to create the JQuery functions for the events. In the index.js we added the following

```js
jQuery('#message-form').on('submit', function(e) {
  // prevents default search query.
  e.preventDefault();
  // emits the event.
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});
```
This says that on submit on the message form button (the id is targeted). We will firstly prevent the default, which is to put the text into a search query. We will then emit the event and create a message. This is being listened to in the server.js

Created another JQuery function that will render the message to the browser.

In the index.js file the following was added

```js
//listening to event on server side.
socket.on('newMessage', function(message) {
  console.log('New Message', message )
  var li = jQuery("<li></li>");
  li.text(`${message.from}: ${message.text}`)

  jQuery('#messages').append(li);

})
```
This is listening to the event on the server side as shown previously in step 5.

## Step 7 - Geolocation

Used a node package called Geolocator. In index.js the following is used.

```js

navigator.geolocation.getCurrentPosition(function(position) {
  console.log(position)
  socket.emit('createLocationMessage', {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  });
}, function () {

  alert('Unable to fetch location.')
});
});
```

Then, in our utils folder in message.js we created a new method.
```js
var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
}
module.exports = {generateMessage, generateLocationMessage}

```

This method is then called in the server.js which is emitting the newLocationMessage event to the index.js as well as listening to the createLocationMessage event from index.js

```js
// listens to creatLocationMessage
socket.on('createLocationMessage', (coords) => {
  io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
})

socket.on('newLocationMessage', function(message){
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);

  li.append(a);
  jQuery('#messages').append(li);
});
```

## Step 8 - Adding Moment and Mustache.
Code of index.js before adding moment.

Moments are used to show timestamps of the messages sent.

```js
// since we loaded library above can call io
// actually initiating request. Making request from client to server to open up a web socket and keep connection open.
var socket =  io();

//want to listen for an event
socket.on('connect', function () {
  console.log('connected to server')
});

socket.on('disconnect', function () {
  console.log('disconnected from server')
});
//listening to event on server side.
socket.on('newMessage', function(message) {
  console.log('New Message', message )
  var li = jQuery("<li></li>");
  li.text(`${message.from}: ${message.text}`)

  jQuery('#messages').append(li);

})

// socket.emit('createMessage', {
//   from: 'Syaf',
//   text: "hi"
// }, function(data) {
//   console.log('Got it!', data)
// })

// new location message listener/handler.
socket.on('newLocationMessage', function(message){
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);

  li.append(a);
  jQuery('#messages').append(li);
});

var messageTextBox = jQuery('[name=message]')
jQuery('#message-form').on('submit', function(e) {
  // prevents default search query.
  e.preventDefault();
  // emits the event.
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    // this will clear the text box.
    messageTextBox.val('')
  });
});

var locationButton = jQuery('#send-location')
locationButton.on('click', function() {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

// so client cannot spam send location button.
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    // will re-enable button after success
    locationButton.removeAttr('disabled').text('Send location')
    console.log(position)
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
      // will re-enable button after failure.
      locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location.')
  });
});
//emitting event to server side
// socket.emit('createMessage', {
//   from: 'john@mail.com',
//   text: 'Hi mr server.'
//   })
// });

// emits to the server, from the client. - relationship with server.
//   socket.emit('createEmail', {
//     to: 'jon@mail.com',
//     text: 'Hey, this is Terry.'
//   });
// });

// custom events.
// socket.on('newEmail', function (email) {
//   console.log('New email', email);
// })
```

The code is now alot more organised. Looking at server.js

```js

//want to listen for an event
socket.on('connect', function () {
  console.log('connected to server')
});

socket.on('disconnect', function () {
  console.log('disconnected from server')
});
//listening to event on server side.
socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
})
// new location message listener/handler.
socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  });


// function for message box.
var messageTextBox = jQuery('[name=message]')
jQuery('#message-form').on('submit', function(e) {
  // prevents default search query.
  e.preventDefault();
  // emits the event.
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    // this will clear the text box.
    messageTextBox.val('')
  });
});
// function for geolocation button.
var locationButton = jQuery('#send-location')
locationButton.on('click', function() {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

// so client cannot spam send location button.
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    // will re-enable button after success
    locationButton.removeAttr('disabled').text('Send location')
    console.log(position)
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
      // will re-enable button after failure.
      locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location.')
  });
});

```
### Passing Room Data
imported the deparam jQuery library

created the validation file with the variable isRealString.

Created listeners and emitters on both chat.js and server.js for when user signs in.

for chat.js

```js
//want to listen for an event
socket.on('connect', function () {
  console.log('connected to server');
  // from our deparam library.
  var params = jQuery.deparam(window.location.search);
  // now can emit an event and set up an acknowledgement
  socket.emit('join', params, function(err) {
    if (err) {
      // redirect them to root page if error.
      alert(err);
      window.location.href = '/'
    } else {
      console.log('No Error')
    }
  })

});

```
For server.js

```js
// for the chat room, join page. Will listen to the event emitted by chat.html
socket.on('join', (params, callback) => {
  if(!isRealString(params.name) || !isRealString(params.room)) {
    callback('Name and room name are required.')
  }
  callback();
})
```

## Storing Users with Classes
We want the createMessage to know who the user is so we can keep messages in certain rooms.

Created a user.js in utils.


## Wiring up User list.
Server needs to emit event to client, and client needs to listen for event.

- In Chat.js added a listener to the connect event.

```js
socket.on('connect', function () {
  console.log('connected to server');
  // from our deparam library.
  var params = jQuery.deparam(window.location.search);
  // now can emit an event and set up an acknowledgement
  socket.emit('join', params, function(err) {
    if (err) {
      // redirect them to root page if error.
      alert(err);
      window.location.href = '/'
    } else {
      console.log('No Error')
    }
  })

});

```

- import users in to server.js then added the getUserList method to the socket.join
```js
// for the chat room, join page. Will listen to the event emitted by chat.html
socket.on('join', (params, callback) => {
  if(!isRealString(params.name) || !isRealString(params.room)) {
    return callback('Name and room name are required.')
  }

  socket.join(params.room);
  // so user cannot be in two rooms at once.
  users.removeUser(socket.id);
  // adds users.
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
```
- When we refresh the page we always get one more added to the array, that is because we haven't removed anything from the array. No remove method, this is put in the disconnect event.
- Now we want to add names to chat, this is done in chat.js in updateUserList, using jQuery.

## Sending Messages to Room Only

Have problems with name and messages in chats going to all different rooms.

Since name is stored by server, can remove from: 'User' in chat.js in createMessage.

```js
var messageTextBox = jQuery('[name=message]')
jQuery('#message-form').on('submit', function(e) {
  // prevents default search query.
  e.preventDefault();
  // emits the event.
  socket.emit('createMessage', {
    text: messageTextBox.val()
  }, function () {
    // this will clear the text box.
    messageTextBox.val('')
  });
});

```

Then went into to server.js to change the createMessage listener. The io.to.().emit will now only emit to the room accessible from user object and the user.name will now print the user's name.

```js
socket.on('createMessage', (message, callback) =>{
  var user = users.getUser(socket.id)
  if (user && isRealString(message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  }

  // this callback is being passed to the socket.emit on createMessage as 'data' placeholder.
  // callback('This is from the server');
  callback();
});

```
