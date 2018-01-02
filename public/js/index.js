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
