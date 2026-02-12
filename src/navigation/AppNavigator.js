import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useRef, useEffect } from 'react';
import ChatsScreen from '../screens/ChatsScreen';
import ChatScreen from '../screens/ChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CallsScreen from '../screens/CallsScreen';
import ArchivedChatsScreen from '../screens/ArchivedChatsScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import SavedMessagesScreen from '../screens/SavedMessagesScreen';
import DevicesScreen from '../screens/DevicesScreen';
import ProfileColorScreen from '../screens/ProfileColorScreen';
import ProfilePhotoScreen from '../screens/ProfilePhotoScreen';
import CallScreen from '../screens/CallScreen';
import ContactProfileScreen from '../screens/ContactProfileScreen';
import ChatColorScreen from '../screens/ChatColorScreen';
import ChatWallpaperScreen from '../screens/ChatWallpaperScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import DataStorageScreen from '../screens/DataStorageScreen';
import HelpScreen from '../screens/HelpScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function TabNavigator() {
  const { chats } = useApp();
  const unreadCount = chats.reduce((sum, chat) => sum + (chat.unread || 0), 0);
  const CustomTabBar = ({ state, navigation }) => {
    const blobPosition = useRef(new Animated.Value(state.index)).current;
    const blobScale = useRef(new Animated.Value(1)).current;
    const blobScaleX = useRef(new Animated.Value(1)).current;
    const blobScaleY = useRef(new Animated.Value(1)).current;
    const blobRotate = useRef(new Animated.Value(0)).current;
    const tabBarBounce = useRef(new Animated.Value(1)).current;
    const tabBarFlash = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.parallel([
        Animated.spring(blobPosition, {
          toValue: state.index,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.sequence([
          Animated.spring(blobScaleX, {
            toValue: 1.08,
            useNativeDriver: true,
            tension: 180,
            friction: 12,
            duration: 200,
          }),
          Animated.spring(blobScaleX, {
            toValue: 1,
            useNativeDriver: true,
            tension: 180,
            friction: 12,
          }),
        ]),
        Animated.sequence([
          Animated.spring(blobScaleY, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 180,
            friction: 12,
            duration: 200,
          }),
          Animated.spring(blobScaleY, {
            toValue: 1,
            useNativeDriver: true,
            tension: 180,
            friction: 12,
          }),
        ]),
        Animated.sequence([
          Animated.spring(blobRotate, {
            toValue: 0.03,
            useNativeDriver: true,
            tension: 180,
            friction: 12,
            duration: 200,
          }),
          Animated.spring(blobRotate, {
            toValue: 0,
            useNativeDriver: true,
            tension: 180,
            friction: 12,
          }),
        ]),
        Animated.sequence([
          Animated.timing(tabBarBounce, {
            toValue: 1.03,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(tabBarBounce, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(tabBarFlash, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(tabBarFlash, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }, [state.index]);
    const blobTranslateX = blobPosition.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: [-120, -40, 40, 120], 
    });
    const blobRotation = blobRotate.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-5deg', '5deg'],
    });
    const flashBackgroundColor = tabBarFlash.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(18, 18, 20, 0.2)', 'rgba(255, 255, 255, 0.15)'],
    });
    return (
      <Animated.View 
        style={[
          styles.tabBarContainer,
          {
            transform: [{ scale: tabBarBounce }],
          },
        ]}
      >
        <Animated.View style={[styles.tabBarBackground, { backgroundColor: flashBackgroundColor }]} />
        <BlurView intensity={120} tint="dark" style={styles.tabBarBlur}>
          <View style={styles.tabBarOverlay} />
          <View style={styles.tabBarContent}>
            <Animated.View
              style={[
                styles.blob,
                {
                  transform: [
                    { translateX: blobTranslateX },
                    { scaleX: blobScaleX },
                    { scaleY: blobScaleY },
                    { rotate: blobRotation },
                  ],
                },
              ]}
            />
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
              let iconName;
              let label;
              let showBadge = false;
              switch (route.name) {
                case 'Contacts':
                  iconName = isFocused ? 'people' : 'people-outline';
                  label = 'Contacts';
                  break;
                case 'Calls':
                  iconName = isFocused ? 'call' : 'call-outline';
                  label = 'Calls';
                  break;
                case 'Chats':
                  iconName = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
                  label = 'Chats';
                  showBadge = unreadCount > 0;
                  break;
                case 'Settings':
                  iconName = isFocused ? 'settings' : 'settings-outline';
                  label = 'Settings';
                  break;
              }
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={styles.tabButton}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabIconContainer}>
                    <Ionicons
                      name={iconName}
                      size={22}
                      color={isFocused ? colors.text : colors.textSecondary}
                    />
                    {showBadge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </Animated.View>
    );
  };
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ArchivedChats" component={ArchivedChatsScreen} />
        <Stack.Screen name="MyProfile" component={MyProfileScreen} />
        <Stack.Screen name="SavedMessages" component={SavedMessagesScreen} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
        <Stack.Screen name="ProfileColor" component={ProfileColorScreen} />
        <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
        <Stack.Screen name="Call" component={CallScreen} />
        <Stack.Screen name="ContactProfile" component={ContactProfileScreen} />
        <Stack.Screen name="ChatColor" component={ChatColorScreen} />
        <Stack.Screen name="ChatWallpaper" component={ChatWallpaperScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
        <Stack.Screen name="DataStorage" component={DataStorageScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    height: 60,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  tabBarBlur: {
    flex: 1,
    borderRadius: 35,
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 35,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  blob: {
    position: 'absolute',
    width: 70,
    height: 62,
    backgroundColor: 'rgba(60, 60, 67, 0.6)',
    borderRadius: 28,
    zIndex: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabIconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  tabLabelActive: {
    color: colors.text,
    fontFamily: typography.semiBold,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: colors.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: typography.bold,
  },
});