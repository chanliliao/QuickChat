import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import router from './router.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './users.js';
import { callbackify } from 'util';
import cors from 'cors';

// set port
const PORT = process.env.PORT || 5000;

// initialized the server
const app = express();

// create a HTTP server object
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'your origin',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// start new connection
io.on('connect', (socket) => {
  // create and join room
  socket.on('join', ({ name, room }, callback) => {
    // add user to the list
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    // shows when joins
    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    // shows others join
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

  // user sendning messages
  socket.on('sendMessage', (message, callback) => {
    // get user info
    const user = getUser(socket.id);

    // send the message
    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // when user leaves
  socket.on('disconnect', () => {
    // remove user from list
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

// routes
app.use('/', router);

app.use(cors());

// let us know the server is running
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
