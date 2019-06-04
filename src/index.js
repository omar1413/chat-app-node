const http = require('http');
const express = require('express');
const path = require('path');
const Filter = require('bad-words');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const {addUser, getUser, removeUser, getUsersInRoom} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const admin = 'Admin'

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
	res.send('index.html');
});

io.on('connection', (socket) => {
	console.log('new connection with socket io');

	socket.on('join', ({ username, room }, callback) => {
		
		const {user, error} = addUser({id: socket.id, username, room})
		if(error){
			return callback(error)
		}
		socket.join(room);
		const users = getUsersInRoom(user.room)
		io.to(user.room).emit('roomData', {room: user.room, users})
		socket.emit('msg', generateMessage(admin, `Welcom ${user.username}`));
		socket.broadcast.to(user.room).emit('msg', generateMessage(admin,`${user.username} joined the room`));
	});

	socket.on('sendMsg', (msg, callback) => {
		if(!msg){
			return callback('message is required')
		}

		const user = getUser(socket.id)
		if(!user){
			return callback('there is no user')
		}
		const filter = new Filter();
		if (filter.isProfane(msg)) {
			return callback('bad word not allowed');
		}

		

		io.to(user.room).emit('msg', generateMessage(user.username,msg));

		callback();
	});

	socket.on('location', (location, callback) => {
		const user = getUser(socket.id)
		if(!user){
			callback('there is no user')
		}
		io.to(user.room).emit(
			'locationMsg',
			generateLocationMessage(user.username,`https://www.google.com/maps?q=${location.latitude},${location.longitude}`)
		);
		callback();
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id)
		if(user){
			const users = getUsersInRoom(user.room)
			io.to(user.room).emit('roomData', {room: user.room, users})
			io.to(user.room).emit('msg', generateMessage(admin, `${user.username} has left`));
		}
	});
});

server.listen(port, () => {
	console.log('app up and running on ' + port);
});
