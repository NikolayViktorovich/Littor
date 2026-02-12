import { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

import ChatsScreen from '../screens/ChatsScreen';
import ChatScreen from '../screens/ChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CallsScreen from '../screens/CallsScreen';
import ArchivedChatsScreen from '../screens/ArchivedChatsScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import SavedMessagesScreen from '../screens/SavedMessagesScreen';
import DevicesScreen from '../screens/DevicesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ iconName, label, focused, badge }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const dropScale = useRef(new Animated.Value(0)).current;
  const dropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Сброс значений
      dropScale.setValue(0);
      dropOpacity.setValue(0);
      
      // Анимация капли
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.3,
            tension: 80,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(dropScale, {
            toValue: 2,
            tension: 60,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(dropOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(dropScale, {
            toValue: 2.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dropOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scale.setValue(1);
      dropScale.setValue(0);
      dropOpacity.setValue(0);
    }
  }, [focused]);

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View
        style={[
          styles.dropEffect,
          {
            transform: [{ scale: dropScale }],
            opacity: dropOpacity,
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }], zIndex: 2 }}>
        <Ionicons 
          name={iconName} 
          size={26} 
          color={colors.text}
        />
      </Animated.View>
      {label && (
        <Text 
          style={[styles.tabLabel, focused && styles.tabLabelFocused]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
      {badge > 0 && (
        <View style={styles.tabBadge}>
          <View style={styles.tabBadgeBackground} />
          <Text style={styles.tabBadgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
};

function TabNavigator() {
  const { chats } = useApp();
  const unreadCount = chats.reduce((sum, chat) => sum + (chat.unread || 0), 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(0, 0, 0, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          height: 84,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null
        ),
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="person-outline" label="Contacts" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="call-outline" label="Calls" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="chatbubble-outline" label="Chats" focused={focused} badge={unreadCount} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon iconName="settings-outline" label="Settings" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ArchivedChats" component={ArchivedChatsScreen} />
        <Stack.Screen name="MyProfile" component={MyProfileScreen} />
        <Stack.Screen name="SavedMessages" component={SavedMessagesScreen} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 70,
  },
  dropEffect: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelFocused: {
    color: colors.text,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: 10,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
  },
  tabBadgeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    zIndex: -1,
  },
  tabBadgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    zIndex: 1,
  },
});
