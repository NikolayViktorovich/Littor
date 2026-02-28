import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme/colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [themeMode, setThemeMode] = useState('auto');

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeMode === 'auto') setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme, themeMode]);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('themeMode');
      if (saved) {
        setThemeMode(saved);
        if (saved === 'dark') setIsDark(true);
        if (saved === 'light') setIsDark(false);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async (mode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem('themeMode', mode);
    
    if (mode === 'dark') setIsDark(true);
    if (mode === 'light') setIsDark(false);
    if (mode === 'auto') setIsDark(systemColorScheme === 'dark');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
