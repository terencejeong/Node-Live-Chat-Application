// since we loaded library above can call io
// actually initiating request. Making request from client to server to open up a web socket and keep connection open.
var socket =  io();

// autoscroll calculations.
function scrollToBottom () {
  // selectors
  var messages = jQuery('#messages');
  // will store selector for the last list item. One just before scrollToBottom
  var newMessage = messages.children('li:last-child')
  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
// jQuery methods vreated above.
    messages.scrollTop(scrollHeight)
  }
}
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

socket.on('disconnect', function () {
  console.log('disconnected from server')
});

socket.on('updateUserList', function (users) {
  // jQuery for names.
   var ol = jQuery('<ol></ol>');

   users.forEach(function(user) {
      ol.append(jQuery('<li></li>').text(user))
   });
   jQuery('#users').html(ol)
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
  //how we had it before mustache.
  // var li = jQuery("<li></li>");
  // li.text(`${message.from} ${formattedTime}: ${message.text}`)
  //
  // jQuery('#messages').append(li);



// socket.emit('createMessage', {
//   from: 'Syaf',
//   text: "hi"
// }, function(data) {
//   console.log('Got it!', data)
// })

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
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);

    // li.append(a);

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
