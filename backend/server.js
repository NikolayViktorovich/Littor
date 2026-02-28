const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chats');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);

const connectedUsers = new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} connected`);
  }

  socket.on('send_message', (message) => io.emit('new_message', message));
  socket.on('typing', ({ chatId, isTyping }) => socket.broadcast.emit('user_typing', { chatId, isTyping, userId }));

  socket.on('disconnect', () => {
    if (userId) {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
