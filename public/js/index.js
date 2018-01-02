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

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

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
