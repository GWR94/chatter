const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
	console.log('New user connected.');

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.');
		}
		socket.join(params.room); //joins the room which was specified in index.html params
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room)
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		//socket.leave(params.room); //will leave the targeted room
		//io.to(params.room).emit //sends an event to everybody in the targeted room
		//socket.broadcast.to(params.room).emit //sends a message to everybody in the targeted room apart from the one that sent it
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
		socket.broadcast
			.to(params.room)
			.emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat room.`));
		callback();
	});

	socket.on('createMessage', (message, callback) => {
		io.emit('newMessage', generateMessage(message.sender, message.text));
		callback();
	});

	socket.on('createLocationMessage', coords => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		const user = users.removeUser(socket.id);
		if(user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
		}
	});
});

server.listen(port, () => {
	console.log(`Server is up at port ${port}`);
});
