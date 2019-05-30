const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormButton = $messageForm.querySelector('#send-button');
const $messageFormInput = $messageForm.querySelector('input');
const $messages = document.querySelector('#messages');
const $locationButton = document.querySelector('#location-button');

//Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('msg', (message) => {
	const html = Mustache.render($messageTemplate, { message });
	$messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMsg', (location) => {
	const html = Mustache.render($locationTemplate, { location });
	$messages.insertAdjacentHTML('beforeend', html);
});

$messageFormInput.focus();

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault();

	$messageFormButton.setAttribute('disabled', 'disabled');

	const message = $messageFormInput.value;

	$messageFormInput.value = '';
	$messageFormInput.focus();

	socket.emit('sendMsg', message, (error) => {
		$messageFormButton.removeAttribute('disabled');
		if (error) {
			return console.log(error);
		}
		console.log('message has been deliverd');
	});
});

$locationButton.addEventListener('click', () => {
	if (navigator.geolocation) {
		$locationButton.setAttribute('disabled', 'disabled');
		navigator.geolocation.getCurrentPosition((pos) => {
			socket.emit(
				'location',
				{
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude
				},
				() => {
					$locationButton.removeAttribute('disabled');
					console.log('location bublished');
				}
			);
		});
	}
});
