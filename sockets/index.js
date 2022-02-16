const moment = require('moment');
const messageModel = require('../models/messageModel');

let users = [];

const addUser = (socket) => {
  const newUser = { socket, nickname: socket.id.slice(0, 16) };
  users.push(newUser);
  return newUser;
};

const findUser = (socket) => users.find((user) => user.socket === socket);

const updateNickname = (socket, nickname) => {
  const userFound = findUser(socket);
  userFound.nickname = nickname;
};

const getNicknames = () => users.map(({ nickname }) => nickname);

const updateList = (io) => io.emit('updateList', getNicknames());

const removerUser = (socket) => {
  users = users.filter((user) => user.socket !== socket);
};

const disconnect = (io, socket) => {
  removerUser(socket);
  updateList(io);  
};

const chat = (io) => {
  io.on('connection', async (socket) => {
    const newUser = addUser(socket);

    socket.emit('updateNickname', newUser.nickname);
    updateList(io);

    const backUpMessages = await messageModel.getAll();

    socket.emit('backUpMessages', backUpMessages);

    socket.on('message', async ({ nickname, chatMessage }) => {
      const timestamp = moment().format('DD-MM-yyyy HH:mm:ss A');
      const msg = `${timestamp} - ${nickname}: ${chatMessage} \n`;
      io.emit('message', msg); 
      await messageModel.setNew({ message: msg, nickname, timestamp });
    });

    socket.on('updateNickname', (nicknameForUpdated) => {
      updateNickname(socket, nicknameForUpdated);
      updateList(io);
    });

    socket.on('disconnect', () => disconnect(io, socket));
  });
};

module.exports = {
  chat,
};
