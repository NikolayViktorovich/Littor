const express = require('express');
const router = express.Router();

const chats = new Map();
const messages = new Map();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

router.use(authMiddleware);

router.get('/', (req, res) => {
  const chatList = Array.from(chats.values()).map(chat => {
    const chatMessages = messages.get(chat.id) || [];
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    return {
      ...chat,
      lastMessage: lastMessage?.text,
      lastMessageTime: lastMessage?.createdAt
    };
  });

  res.json(chatList);
});

router.get('/:chatId/messages', (req, res) => {
  const chatMessages = messages.get(req.params.chatId) || [];
  res.json(chatMessages);
});

router.post('/:chatId/messages', (req, res) => {
  const { chatId } = req.params;
  const { text, replyTo } = req.body;
  const senderId = req.headers['user-id'] || '1';
  
  const message = {
    id: Date.now().toString(),
    chatId,
    senderId,
    text,
    replyTo: replyTo || null,
    createdAt: new Date().toISOString()
  };

  if (!messages.has(chatId)) messages.set(chatId, []);
  messages.get(chatId).push(message);
  
  res.json(message);
});

if (chats.size === 0) {
  chats.set('1', { id: '1', name: 'Общий чат', type: 'group' });
  chats.set('2', { id: '2', name: 'Иван Петров', type: 'private' });
}

module.exports = router;
