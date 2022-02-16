const express = require('express');
const cors = require('cors');

const app = express();
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

io.on('connect', (socket) => {
  console.log(`User ID: ${socket.id} connected`);
});

const socket = require('./sockets');

socket.chat(io);

app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', './public');

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

const PORT = 3000;

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));