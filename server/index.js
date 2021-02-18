import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const PORT = process.env.PORT || 5000;

const app = express();

const server = createServer(app);
const io = new Server(server, {
  // ...
});

io.on('connection', (socket) => {
  // ...
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
