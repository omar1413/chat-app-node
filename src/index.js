const http = require('http');
const express = require('express');
const path = require('path');
const Filter = require('bad-words');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
	res.send('index.html');
});

let count = 0;
io.on('connection', (socket) => {
	console.log('new connection with socket io');

	socket.emit('msg', 'welcome and hello');
	socket.broadcast.emit('msg', 'new user loged in');
	socket.on('sendMsg', (msg, callback) => {
		const filter = new Filter();
		if (filter.isProfane(msg)) {
			return callback('bad word not allowed');
		}

		io.emit('msg', msg);

		callback();
	});

	socket.on('location', (location, callback) => {
		io.emit('locationMsg', `https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
		callback();
	});

	socket.on('disconnect', () => {
		io.emit('msg', 'a user has disconnected');
	});
});

server.listen(port, () => {
	console.log('app up and running on ' + port);
});
