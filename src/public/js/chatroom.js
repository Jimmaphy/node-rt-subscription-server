(function connect() {
    // Connect to the server
    let socket = io.connect('localhost:3000');

    // Dom elements for changing the username
    let username = document.querySelector('#username');
    let usernameBtn = document.querySelector('#usernameBtn');
    let curUsername = document.querySelector('.card-header');

    // Change username
    usernameBtn.addEventListener('click', event => {
        console.log(username.value);
        socket.emit('change_username', {username: username.value});
        curUsername.textContent = username.value;
        username.value = '';
    });

    // Dom elements for sending messages
    let message = document.querySelector('#message');
    let messageBtn = document.querySelector('#messageBtn');
    let messageList = document.querySelector('#message-list');

    // Sending messages
    messageBtn.addEventListener('click', event => {
        console.log(message.value);
        socket.emit('new_message', {message: message.value});
        message.value = '';
    });
  
    // Receiving messages
    socket.on('receive_message', data => {
        console.log(data);
        let listItem = document.createElement('li');
        listItem.textContent = data.username + ': ' + data.message
        listItem.classList.add('list-group-item');
        messageList.appendChild(listItem);
    });

    // Dom elements for the info field
    let info = document.querySelector('.info');

    // Tell the server when we're typing
    message.addEventListener('keypress', event => {
        socket.emit('typing');
    });

    // Handle typing of other users
    socket.on('typing', data => {
        info.textContent = data.username + " is typing...";
        setTimeout(() => {info.textContent = ''}, 5000);
    })
})()
