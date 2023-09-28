// Setup the dependencies
const express = require('express');
const sockets = require('socket.io');

// Setup the express server
const app = express();
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('./src/public'));

// Create the routes
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
const server = app.listen(process.env.PORT || 3000, () => {
    console.log('server is running');
});

// Setup the socket
const socket = sockets(server)

// Enable the socket
socket.on('connection', connection => {
    // Show that a user has connected
    console.log('New user connected');

    // Set the default username
    connection.username = 'Anonymous';

    // Handle a username change
    connection.on('changeUsername', data => {
        socket.username = data.username;
    });

    // Handle new messages
    connection.on('new_messages', data => {
        console.log('New message');
        socket.sockets.emits('receive_message', {message: data.message, username: socket.username});
    });

    // Handle users typing
    connection.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username});
    })
});
