import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { API_URL } from '../config/api';
import socketService from '../services/socket';
import SwipeableChat from '../components/SwipeableChat';

export default function ChatsScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    loadChats();
    socketService.connect(user.id);

    socketService.on('new_message', (message) => {
      updateChatPreview(message);
    });

    socketService.on('user_typing', ({ chatId, isTyping }) => {
      setChats(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, isTyping } : chat
      ));
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadChats = async () => {
    try {
      const response = await axios.get(`${API_URL}/chats`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setChats(response.data.map(chat => ({ 
        ...chat, 
        unreadCount: Math.floor(Math.random() * 5),
        online: Math.random() > 0.5
      })));
    } catch (error) {
      console.error('Load chats error:', error);
    }
  };

  const updateChatPreview = (message) => {
    setChats(prev => {
      const updated = prev.map(chat => 
        chat.id === message.chatId
          ? { ...chat, lastMessage: message.text, lastMessageTime: message.createdAt, unreadCount: (chat.unreadCount || 0) + 1 }
          : chat
      );
      return updated.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });
    });
  };

  const handlePin = (chatId) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
  };

  const handleMute = (chatId) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
    ));
  };

  const handleDelete = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} />
      
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
          
          <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground }]}>
            <Ionicons name="search" size={18} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Поиск"
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, { color: theme.text }, activeTab === 'all' && styles.tabTextActive]}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'unread' && styles.tabActive]}
            onPress={() => setActiveTab('unread')}
          >
            <Text style={[styles.tabText, { color: theme.text }, activeTab === 'unread' && styles.tabTextActive]}>
              Непрочитанные
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredChats}
        renderItem={({ item }) => (
          <SwipeableChat
            chat={item}
            onPress={() => navigation.navigate('Chat', { chat: item })}
            onPin={() => handlePin(item.id)}
            onMute={() => handleMute(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={[styles.bottomNav, { backgroundColor: theme.background, borderTopColor: theme.divider }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navLabel, { color: theme.textSecondary }]}>Контакты</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="call-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navLabel, { color: theme.textSecondary }]}>Звонки</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles" size={24} color={theme.primary} />
          <Text style={[styles.navLabel, { color: theme.primary }]}>Чаты</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={theme.textSecondary} />
          <Text style={[styles.navLabel, { color: theme.textSecondary }]}>Настройки</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 18,
  },
  tabActive: {
    backgroundColor: 'rgba(136, 116, 225, 0.15)',
  },
  tabText: {
    fontSize: 15,
  },
  tabTextActive: {
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});
