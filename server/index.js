import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import router from './router.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './users.js';
import { callbackify } from 'util';

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

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name}, has joined!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left.`,
      });
    }
  });
});

app.use('/', router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
