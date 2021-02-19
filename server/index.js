import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import router from './router.js';

const PORT = process.env.PORT || 5000;

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'your origin',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('We have a new connection!');

  socket.on('join', ({ name, room }) => {
    console.log(name, room);
  });

  socket.on('disconnect', () => {
    console.log('User had left!');
  });
});

app.use('/', router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
