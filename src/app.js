// Setup the dependencies
const express = require('express');
const sockets = require('socket.io');
const sqlite = require('./data/sqlite-connection.js');

// Setup the express server
const app = express();
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('./src/public'));

// Create the routes
app.get('/', (req, res) => {
  sqlite.write('hello world!');
  res.render('index');
});

// Start the server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('server is running');
});

// Setup the socket
const socket = sockets(server)

// Update all clients
function update() {
  socket.sockets.emit('receive_message', {message: "update", username: "[System]"});
}

// Enable the socket
socket.on('connection', connection => {
  // Show that a user has connected
  console.log('New client connected...');
  
  // Set the default username
  connection.username = 'Anonymous';

  // Handle a username change
  connection.on('change_username', data => {
    connection.username = data.username;
    update();
  });

  // Handle new messages
  connection.on('new_message', data => {j
    console.log('New message');
    socket.sockets.emit('receive_message', {message: data.message, username: connection.username});
  });

  // Handle users typing
  connection.on('typing', data => {
    connection.broadcast.emit('typing', {username: connection.username});
  });
});
