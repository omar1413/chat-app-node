const http = require('http');
const express = require('express');
const path = require('path');
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

io.on('connection', () => {
	console.log('new connection with socket io');
});

server.listen(port, () => {
	console.log('app up and running on ' + port);
});
