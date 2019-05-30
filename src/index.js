const http = require('http');
const express = require('express');
const path = require('path');
const Filter = require('bad-words');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
	res.send('index.html');
});

io.on('connection', (socket) => {
	console.log('new connection with socket io');

	socket.on('join', ({ username, room }) => {
		socket.join(room);
		socket.emit('msg', generateMessage(`Welcom ${username}`));
		socket.broadcast.to(room).emit('msg', generateMessage(`${username} joined the room`));
	});

	socket.on('sendMsg', (msg, callback) => {
		const filter = new Filter();
		if (filter.isProfane(msg)) {
			return callback('bad word not allowed');
		}

		io.emit('msg', generateMessage(msg));

		callback();
	});

	socket.on('location', (location, callback) => {
		io.emit(
			'locationMsg',
			generateLocationMessage(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`)
		);
		callback();
	});

	socket.on('disconnect', () => {
		io.emit('msg', generateMessage('a user has disconnected'));
	});
});

server.listen(port, () => {
	console.log('app up and running on ' + port);
});
