const socket = io();

socket.on('connect', function() {
	console.log('Connected to server.');
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = jQuery('#message-template').html();
	const html = Mustache.render(template, {
		sender: message.sender,
		text: message.text,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a');
	const template = jQuery('#location-message-template').html();
	const html = Mustache.render(template, {
		sender: message.sender,
		createdAt: formattedTime,
		url: message.url
	})
	jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e) {
	e.preventDefault();

	const messageTextbox = jQuery('[name=message]');
	socket.emit(
		'createMessage',
		{
			sender: 'User',
			text: messageTextbox.val(),
		},
		function() {
			messageTextbox.val('');
		}
	);
});

const locationButton = jQuery('#send-location');

locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled').text('Sending Location...');

	navigator.geolocation.getCurrentPosition(
		function(position) {
			locationButton.removeAttr('disabled').text('Send Location');
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		},
		function() {
			locationButton.removeAttr('disabled').text('Send Location');
			alert('Unable to fetch location');
		}
	);
});
