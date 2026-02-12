import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const STORAGE_KEYS = {
  CHATS: '@chats',
  CONTACTS: '@contacts',
  CALLS: '@calls',
  MESSAGES: '@messages',
  PROFILE: '@profile',
  ARCHIVED_CHATS: '@archived_chats',
};

const DEFAULT_PROFILE = {
  name: 'NIKOLAS',
  phone: '+7 951 444 3122',
  username: 'shouldcleanmyr',
  avatar: 'N',
  bio: '',
};

export const AppProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [calls, setCalls] = useState([]);
  const [messages, setMessages] = useState({});
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [archivedChats, setArchivedChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [chatsData, contactsData, callsData, messagesData, profileData, archivedData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CHATS),
        AsyncStorage.getItem(STORAGE_KEYS.CONTACTS),
        AsyncStorage.getItem(STORAGE_KEYS.CALLS),
        AsyncStorage.getItem(STORAGE_KEYS.MESSAGES),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.ARCHIVED_CHATS),
      ]);

      if (chatsData) setChats(JSON.parse(chatsData));
      if (contactsData) setContacts(JSON.parse(contactsData));
      if (callsData) setCalls(JSON.parse(callsData));
      if (messagesData) setMessages(JSON.parse(messagesData));
      if (profileData) setProfile(JSON.parse(profileData));
      if (archivedData) setArchivedChats(JSON.parse(archivedData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addMessage = (chatId, message) => {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      dateGroup: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      isMine: true,
      hasCheck: true,
    };

    setMessages(prev => {
      const updated = {
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      };
      saveData(STORAGE_KEYS.MESSAGES, updated);
      return updated;
    });

    setChats(prev => {
      const updated = prev.map(chat =>
        chat.id === chatId
          ? { ...chat, lastMessage: message, time: 'now', isYou: true }
          : chat
      );
      saveData(STORAGE_KEYS.CHATS, updated);
      return updated;
    });

    return newMessage;
  };

  const createChat = (contact) => {
    const existingChat = chats.find(chat => chat.name === contact.name);
    if (existingChat) return existingChat;

    const newChat = {
      id: Date.now().toString(),
      name: contact.name,
      lastMessage: '',
      time: 'now',
      unread: 0,
      online: contact.online,
      pinned: false,
      verified: false,
    };

    setChats(prev => {
      const updated = [newChat, ...prev];
      saveData(STORAGE_KEYS.CHATS, updated);
      return updated;
    });

    return newChat;
  };

  const archiveChat = (chatId) => {
    setChats(prev => {
      const chatToArchive = prev.find(chat => chat.id === chatId);
      if (!chatToArchive) return prev;

      setArchivedChats(prevArchived => {
        const updated = [...prevArchived, chatToArchive];
        saveData(STORAGE_KEYS.ARCHIVED_CHATS, updated);
        return updated;
      });

      const updated = prev.filter(chat => chat.id !== chatId);
      saveData(STORAGE_KEYS.CHATS, updated);
      return updated;
    });
  };

  const unarchiveChat = (chatId) => {
    setArchivedChats(prev => {
      const chatToUnarchive = prev.find(chat => chat.id === chatId);
      if (!chatToUnarchive) return prev;

      setChats(prevChats => {
        const updated = [chatToUnarchive, ...prevChats];
        saveData(STORAGE_KEYS.CHATS, updated);
        return updated;
      });

      const updated = prev.filter(chat => chat.id !== chatId);
      saveData(STORAGE_KEYS.ARCHIVED_CHATS, updated);
      return updated;
    });
  };

  const deleteChat = (chatId) => {
    setChats(prev => {
      const updated = prev.filter(chat => chat.id !== chatId);
      saveData(STORAGE_KEYS.CHATS, updated);
      return updated;
    });

    setMessages(prev => {
      const updated = { ...prev };
      delete updated[chatId];
      saveData(STORAGE_KEYS.MESSAGES, updated);
      return updated;
    });
  };

  const clearMessages = (chatId) => {
    setMessages(prev => {
      const updated = { ...prev };
      updated[chatId] = [];
      saveData(STORAGE_KEYS.MESSAGES, updated);
      return updated;
    });

    setChats(prev => {
      const updated = prev.map(chat =>
        chat.id === chatId
          ? { ...chat, lastMessage: '', time: '' }
          : chat
      );
      saveData(STORAGE_KEYS.CHATS, updated);
      return updated;
    });
  };

  const blockUser = (chatId) => {
    setChats(prev => {
      const updated = prev.map(chat =>
        chat.id === chatId
          ? { ...chat, blocked: true }
          : chat
      );
      saveData(STORAGE_KEYS.CHATS, updated);
      return updated;
    });
  };

  const unblockUser = (chatId) => {
    setChats(prev => {
      const updated = prev.map(chat =>
        chat.id === chatId
          ? { ...chat, blocked: false }
          : chat
      );
      saveData(STORAGE_KEYS.CHATS, updated);
      return updated;
    });
  };

  const addContact = (contact) => {
    const newContact = {
      id: Date.now().toString(),
      name: contact.name,
      status: 'last seen recently',
      online: false,
    };

    setContacts(prev => {
      const updated = [newContact, ...prev];
      saveData(STORAGE_KEYS.CONTACTS, updated);
      return updated;
    });

    return newContact;
  };

  const addCall = (contact, type, duration = null) => {
    const newCall = {
      id: Date.now().toString(),
      name: contact.name,
      type,
      duration,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setCalls(prev => {
      const updated = [newCall, ...prev];
      saveData(STORAGE_KEYS.CALLS, updated);
      return updated;
    });

    return newCall;
  };

  const updateProfile = (updates) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveData(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  };

  const value = {
    chats,
    contacts,
    calls,
    messages,
    profile,
    archivedChats,
    isLoading,
    addMessage,
    createChat,
    archiveChat,
    unarchiveChat,
    deleteChat,
    clearMessages,
    blockUser,
    unblockUser,
    addContact,
    addCall,
    updateProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
