const socket = window.io();
const nicknameButton = document.querySelector('#nickname-button');
const sendButton = document.querySelector('#send-button');
const onlineUsers = document.querySelector('#online-users');
const messageHistory = document.querySelector('#message-history');
let nickname = null;

nicknameButton.addEventListener('click', () => {
  const nicknameBox = document.querySelector('#nickname-box');
  socket.emit('updateNickname', nicknameBox.value);
  nickname = nicknameBox.value;
  nicknameBox.value = '';
});

sendButton.addEventListener('click', () => {
  const chatMessage = document.querySelector('#message-box');
  socket.emit('message', {
    nickname,
    chatMessage: chatMessage.value,
  });
  chatMessage.value = '';
});

const createMessage = (message) => {
  const msg = document.createElement('li');
  msg.setAttribute('data-testid', 'message');
  msg.innerText = message;
  messageHistory.appendChild(msg);
};

const createUser = (nicknameServer) => {
  const user = document.createElement('li');
  user.setAttribute('data-testid', 'online-user');
  user.innerHTML = nicknameServer;
  onlineUsers.appendChild(user);
};

socket.on('updateList', (usersList) => {
  onlineUsers.innerHTML = '';
  createUser(nickname);
  usersList.forEach((user) => {
    if (user !== nickname) {
      createUser(user);
    }
  });
});

socket.on('message', createMessage);

socket.on('updateNickname', (nicknameServer) => {
  nickname = nicknameServer;
});

socket.on('backUpMessages', (msgs) => msgs
.forEach(({ message, nickname: n, timestamp }) => {
  createMessage(`${timestamp} - ${n}: ${message} \n`);
}));