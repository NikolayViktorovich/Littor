import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_CHATS, INITIAL_CONTACTS, INITIAL_CALLS, INITIAL_MESSAGES } from '../utils/mockData';
const STORAGE_KEYS = {
  CHATS: '@chats',
  CONTACTS: '@contacts',
  CALLS: '@calls',
  MESSAGES: '@messages',
  INITIALIZED: '@initialized',
};
export const useInitialData = () => {
  useEffect(() => {
    initializeData();
  }, []);
  const initializeData = async () => {
    try {
      const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!initialized) {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(INITIAL_CHATS)),
          AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_CONTACTS)),
          AsyncStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(INITIAL_CALLS)),
          AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES)),
          AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true'),
        ]);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };
};
