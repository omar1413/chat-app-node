const socket = io();

socket.on('msg', (msg) => {
	console.log(msg);
});

document.querySelector('form').addEventListener('submit', (e) => {
	e.preventDefault();

	const message = e.target.elements.message.value;

	socket.emit('sendMsg', message);
});

document.querySelector('#location').addEventListener('click', () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((pos) => {
			socket.emit('location', {
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude
			});
		});
	}
});
