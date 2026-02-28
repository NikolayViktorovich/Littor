import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { API_URL } from '../config/api';
import socketService from '../services/socket';
import MessageBubble from '../components/MessageBubble';

export default function ChatScreen({ route, navigation }) {
  const { chat } = route.params;
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadMessages();

    socketService.on('new_message', (message) => {
      if (message.chatId === chat.id && message.senderId !== user.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socketService.on('user_typing', ({ chatId, isTyping: typing }) => {
      if (chatId === chat.id) {
        setIsTyping(typing);
      }
    });

    return () => {
      socketService.off('new_message');
      socketService.off('user_typing');
    };
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/chats/${chat.id}/messages`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(response.data.map(msg => ({ ...msg, isRead: Math.random() > 0.5 })));
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const handleTyping = (text) => {
    setInputText(text);
    
    socketService.emit('typing', { chatId: chat.id, isTyping: true });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('typing', { chatId: chat.id, isTyping: false });
    }, 1000);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');
    
    const messageData = {
      text: messageText,
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text } : null
    };
    
    setReplyTo(null);

    try {
      const response = await axios.post(
        `${API_URL}/chats/${chat.id}/messages`,
        messageData,
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'user-id': user.id
          } 
        }
      );

      const newMessage = { ...response.data, senderId: user.id, isRead: false };
      setMessages(prev => [...prev, newMessage]);
      
      // Отправляем через сокет только для других пользователей
      socketService.emit('send_message', newMessage);
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isOwn = item.senderId === user.id;
    
    return (
      <MessageBubble
        key={`${item.id}-${index}`}
        message={item}
        isOwn={isOwn}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.chatBackground }]}>
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.divider }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{chat.name[0].toUpperCase()}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{chat.name}</Text>
            {isTyping ? (
              <Text style={[styles.typingIndicator, { color: theme.typing }]}>печатает...</Text>
            ) : (
              <Text style={[styles.onlineStatus, { color: theme.textSecondary }]}>был(а) недавно</Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {replyTo && (
          <View style={[styles.replyContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <View style={styles.replyContent}>
              <Text style={[styles.replyLabel, { color: theme.primary }]}>Ответ на:</Text>
              <Text style={[styles.replyText, { color: theme.text }]} numberOfLines={1}>
                {replyTo.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={[styles.inputContainer, { backgroundColor: theme.background, borderTopColor: theme.divider }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle" size={28} color={theme.primary} />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              placeholder="Сообщение"
              value={inputText}
              onChangeText={handleTyping}
              multiline
              maxLength={1000}
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          
          {inputText.trim() ? (
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.primary }]}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.voiceButton}>
              <Ionicons name="mic" size={24} color={theme.primary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  typingIndicator: {
    fontSize: 13,
    marginTop: 1,
  },
  onlineStatus: {
    fontSize: 13,
    marginTop: 1,
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    paddingVertical: 8,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    alignItems: 'flex-end',
  },
  attachButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
