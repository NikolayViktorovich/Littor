import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
  Alert,
  Share,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SearchBar } from '../components/SearchBar';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { ChatMenu } from '../components/ChatMenu';
export default function ChatScreen({ route, navigation }) {
  const { chat } = route.params;
  const { messages, addMessage, clearMessages, blockUser, unblockUser, chats } = useApp();
  const [message, setMessage] = useState('');
  const [isMic, setIsMic] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [messageMenuVisible, setMessageMenuVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('recent');
  const [recentEmojis, setRecentEmojis] = useState(['😀', '👍', '❤️', '😂', '🔥', '👏', '😊', '🎉']);
  const [selectedSkinTone, setSelectedSkinTone] = useState('');
  const flatListRef = useRef(null);
  const messageMenuOpacity = useRef(new Animated.Value(0)).current;
  const messageMenuScale = useRef(new Animated.Value(0.8)).current;
  const searchBlockOpacity = useRef(new Animated.Value(0)).current;
  const searchBlockTranslateY = useRef(new Animated.Value(-20)).current;
  const emojiPickerHeight = useRef(new Animated.Value(0)).current;
  const chatMessages = messages[chat.id] || [];
  const currentChat = chats.find(c => c.id === chat.id) || chat;
  const isBlocked = currentChat.blocked || false;
  const chatColor = currentChat.chatColor || '#007AFF';
  const wallpaperUri = currentChat.wallpaperUri;
  const wallpaperBrightness = currentChat.wallpaperBrightness ?? 1;
  const wallpaperBlur = currentChat.wallpaperBlur ?? 0;
  const wallpaperOpacity = currentChat.wallpaperOpacity ?? 1;
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = chatMessages
        .map((msg, index) => ({ ...msg, index }))
        .filter(msg => 
          msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
      setSearchResults(results);
      setCurrentSearchIndex(0);
      if (results.length > 0) {
        scrollToMessage(results[0].index);
      }
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  }, [searchQuery]);
  const scrollToMessage = (index) => {
    if (flatListRef.current && index >= 0 && index < chatMessages.length) {
      requestAnimationFrame(() => {
        try {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
            viewOffset: 0,
          });
        } catch (error) {
          console.log('Scroll error:', error);
        }
      });
    }
  };
  const handleNextSearchResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      scrollToMessage(searchResults[nextIndex].index);
    }
  };
  const handlePrevSearchResult = () => {
    if (searchResults.length > 0) {
      const prevIndex = currentSearchIndex === 0 
        ? searchResults.length - 1 
        : currentSearchIndex - 1;
      setCurrentSearchIndex(prevIndex);
      scrollToMessage(searchResults[prevIndex].index);
    }
  };
  const closeSearch = () => {
    Animated.parallel([
      Animated.timing(searchBlockOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(searchBlockTranslateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSearchVisible(false);
      setSearchQuery('');
      setSearchResults([]);
      setCurrentSearchIndex(0);
    });
  };
  const openSearch = () => {
    setSearchVisible(true);
    Animated.parallel([
      Animated.spring(searchBlockOpacity, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(searchBlockTranslateY, {
        toValue: 0,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const openEmojiPicker = () => {
    setEmojiPickerVisible(true);
    Animated.spring(emojiPickerHeight, {
      toValue: 320,
      tension: 100,
      friction: 10,
      useNativeDriver: false,
    }).start();
  };
  const closeEmojiPicker = () => {
    Animated.timing(emojiPickerHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setEmojiPickerVisible(false);
    });
  };
  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji);
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji);
      return [emoji, ...filtered].slice(0, 16);
    });
  };
  const emojiCategories = {
    recent: {
      name: 'Recent',
      icon: 'time-outline',
      emojis: recentEmojis,
    },
    smileys: {
      name: 'Smileys',
      icon: 'happy-outline',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
        '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
        '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
        '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
        '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
        '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠',
        '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️',
      ],
    },
    gestures: {
      name: 'Gestures',
      icon: 'hand-left-outline',
      emojis: [
        '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️',
        '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆',
        '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙',
        '💪', '🦾', '🖕', '✍️', '🙏', '🦶', '🦵', '🦿',
        '💅', '🤳',
      ],
    },
    hearts: {
      name: 'Hearts',
      icon: 'heart-outline',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
        '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
        '💘', '💝', '💟', '☮️', '💌', '💋', '💑', '💏',
      ],
    },
    animals: {
      name: 'Animals',
      icon: 'paw-outline',
      emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
        '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
        '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞',
      ],
    },
    food: {
      name: 'Food',
      icon: 'fast-food-outline',
      emojis: [
        '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈',
        '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆',
        '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄',
        '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨',
      ],
    },
    activities: {
      name: 'Activities',
      icon: 'football-outline',
      emojis: [
        '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
        '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
        '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
        '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌',
      ],
    },
    objects: {
      name: 'Objects',
      icon: 'bulb-outline',
      emojis: [
        '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️',
        '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸',
        '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠',
        '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️',
      ],
    },
  };
  const emojis = emojiCategories[selectedEmojiCategory]?.emojis || [];
  const displayEmojis = selectedEmojiCategory === 'gestures' && selectedSkinTone
    ? emojis.map(emoji => {
        const supportsSkinTone = ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', 
          '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', 
          '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🖕', '✍️', '🙏', 
          '🦶', '🦵', '💅', '🤳'];
        return supportsSkinTone.includes(emoji) ? emoji + selectedSkinTone : emoji;
      })
    : emojis;
  const handleLongPressMessage = (item, event) => {
    setSelectedMessage(item);
    setMessageMenuVisible(true);
    Animated.parallel([
      Animated.spring(messageMenuOpacity, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(messageMenuScale, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeMessageMenu = () => {
    Animated.parallel([
      Animated.timing(messageMenuOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(messageMenuScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMessageMenuVisible(false);
      setSelectedMessage(null);
    });
  };
  const handleMessageAction = (action) => {
    closeMessageMenu();
    setTimeout(() => {
      switch (action) {
        case 'reply':
          Alert.alert('Reply', `Reply to: ${selectedMessage?.text}`);
          break;
        case 'copy':
          Alert.alert('Copied', 'Message copied to clipboard');
          break;
        case 'edit':
          Alert.alert('Edit', 'Edit message');
          break;
        case 'pin':
          Alert.alert('Pin', 'Message pinned');
          break;
        case 'forward':
          Alert.alert('Forward', 'Forward message');
          break;
        case 'delete':
          Alert.alert('Delete', 'Message deleted');
          break;
        case 'select':
          Alert.alert('Select', 'Select mode activated');
          break;
      }
    }, 300);
  };
  const handleReaction = (emoji) => {
    closeMessageMenu();
    setTimeout(() => {
      Alert.alert('Reaction', `Added ${emoji} reaction`);
    }, 300);
  };
  useEffect(() => {
    if (flatListRef.current && chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, []);
  useEffect(() => {
    if (flatListRef.current && chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages.length]);
  const handleSendMessage = () => {
    if (message.trim()) {
      if (isBlocked) {
        Alert.alert('User Blocked', 'Unblock this user to send messages');
        return;
      }
      addMessage(chat.id, message.trim());
      setMessage('');
      if (emojiPickerVisible) {
        closeEmojiPicker();
      }
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  const handleCall = (callType = 'audio') => {
    const contact = {
      name: chat.name,
      profileColor: chat.profileColor,
      photoUri: chat.photoUri,
    };
    navigation.navigate('Call', { contact, type: 'outgoing', callType });
  };
  const handleOpenProfile = () => {
    const contact = {
      name: chat.name,
      profileColor: chat.profileColor,
      photoUri: chat.photoUri,
      online: chat.online,
      status: chat.status,
    };
    navigation.navigate('ContactProfile', { contact });
  };
  const handleMenuOption = (option) => {
    switch (option) {
      case 'wallpaper':
        break;
      case 'secret':
        Alert.alert(
          'Start Secret Chat',
          'Secret chat with end-to-end encryption will be started',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Start', onPress: () => Alert.alert('Secret Chat', 'Secret chat started!') },
          ]
        );
        break;
      case 'share':
        Share.share({
          message: `Contact: ${chat.name}`,
          title: 'Share Contact',
        }).catch(err => console.log(err));
        break;
      case 'clear':
        Alert.alert(
          'Clear Messages',
          'Are you sure you want to delete all messages in this chat?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Clear', 
              style: 'destructive',
              onPress: () => {
                clearMessages(chat.id);
                Alert.alert('Success', 'All messages have been cleared');
              }
            },
          ]
        );
        break;
      case 'block':
        if (isBlocked) {
          Alert.alert(
            'Unblock User',
            `Unblock ${chat.name}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Unblock', 
                onPress: () => {
                  unblockUser(chat.id);
                  Alert.alert('Success', `${chat.name} has been unblocked`);
                }
              },
            ]
          );
        } else {
          Alert.alert(
            'Block User',
            `Block ${chat.name}? You won't receive messages from this user.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Block', 
                style: 'destructive',
                onPress: () => {
                  blockUser(chat.id);
                  Alert.alert('Success', `${chat.name} has been blocked`);
                }
              },
            ]
          );
        }
        break;
    }
  };
  const pan = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          const progress = Math.min(Math.abs(gestureState.dy) / 50, 1);
          pan.setValue(gestureState.dy);
          opacity.setValue(1 - progress * 0.5);
          scale.setValue(1 - progress * 0.2);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(pan, {
              toValue: -60,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsMic(prev => !prev);
            pan.setValue(60);
            Animated.parallel([
              Animated.spring(pan, {
                toValue: 0,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
              }),
              Animated.spring(opacity, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
              }),
              Animated.spring(scale, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
              }),
            ]).start();
          });
        } else {
          Animated.parallel([
            Animated.spring(pan, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;
  const renderDateSeparator = (date) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
  const renderMessage = ({ item, index }) => {
    const showDate = index === 0 || chatMessages[index - 1]?.dateGroup !== item.dateGroup;
    const isHighlighted = searchResults.some(result => result.id === item.id);
    const isCurrentResult = searchResults[currentSearchIndex]?.id === item.id;
    const handleMessagePress = () => {
      if (searchVisible) {
        closeSearch();
      }
    };
    return (
      <>
        {showDate && renderDateSeparator(item.dateGroup)}
        {item.type === 'channel' ? (
          <TouchableOpacity 
            style={styles.channelMessage}
            activeOpacity={0.9}
            onPress={handleMessagePress}
          >
            <View style={styles.channelAvatar}>
              <Text style={styles.channelAvatarText}>{item.avatar}</Text>
            </View>
            <View style={styles.channelContent}>
              <View style={styles.channelHeader}>
                <Text style={styles.channelName}>{item.channelName}</Text>
                <View style={styles.channelInfo}>
                  <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.channelViews}>{item.views}</Text>
                  <Text style={styles.channelDate}>{item.date}</Text>
                </View>
              </View>
              <Text style={styles.channelText}>{item.text}</Text>
            </View>
            <TouchableOpacity style={styles.forwardButton}>
              <Ionicons name="arrow-redo" size={20} color={colors.text} />
            </TouchableOpacity>
          </TouchableOpacity>
        ) : item.image ? (
          <TouchableOpacity 
            style={styles.imageMessageContainer}
            activeOpacity={0.9}
            onPress={handleMessagePress}
          >
            <View style={styles.imageMessage}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image" size={60} color={colors.textSecondary} />
              </View>
              <TouchableOpacity style={styles.imageDownload}>
                <Ionicons name="chevron-down" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : item.sender ? (
          <View style={styles.messageContainer}>
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>{item.avatar}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleMessagePress}
              onLongPress={(e) => handleLongPressMessage(item, e)}
              delayLongPress={500}
            >
              <View 
                style={[
                  styles.incomingBubble, 
                  isHighlighted && !isCurrentResult && styles.searchResult, 
                  isCurrentResult && styles.currentSearchResult,
                ]}
              >
                <Text style={styles.senderName}>{item.sender}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : item.isMine && item.text ? (
          <TouchableOpacity
            style={styles.myMessageContainer}
            activeOpacity={0.9}
            onPress={handleMessagePress}
            onLongPress={(e) => handleLongPressMessage(item, e)}
            delayLongPress={500}
          >
            <View 
              style={[
                styles.myMessageBubble,
                { backgroundColor: chatColor },
                isCurrentResult && styles.currentSearchResult,
                isHighlighted && !isCurrentResult && styles.searchResult,
              ]}
            >
              <Text style={styles.myMessageText}>{item.text}</Text>
              <View style={styles.myMessageFooter}>
                <Text style={styles.myMessageTime}>{item.time}</Text>
                {item.hasCheck && <Ionicons name="checkmark-done" size={16} color="rgba(255,255,255,0.7)" />}
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)']}
          locations={[0, 0.5, 0.8, 1]}
          style={styles.headerGradient}
        />
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <BlurView intensity={120} tint="dark" style={styles.headerButtonBlur}>
              <View style={styles.headerButtonOverlay} />
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color={colors.text} />
              </TouchableOpacity>
            </BlurView>
            <View style={styles.backBadgeWrapper}>
              <View style={styles.backBadge}>
                <Text style={styles.backBadgeText}>6</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.headerAvatar}
              onPress={handleOpenProfile}
              activeOpacity={0.7}
            >
              <View style={[styles.headerAvatarCircle, { backgroundColor: chat.profileColor || '#FF3B30' }]}>
                {chat.photoUri ? (
                  <Image source={{ uri: chat.photoUri }} style={styles.headerAvatarImage} />
                ) : (
                  <Text style={styles.headerAvatarText}>{chat.name[0].toUpperCase()}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.headerCenterWrapper}
            onPress={handleOpenProfile}
            activeOpacity={0.7}
          >
            <BlurView intensity={120} tint="dark" style={styles.headerCenterBlur}>
              <View style={styles.headerCenterOverlay} />
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle} numberOfLines={1}>{chat.name}</Text>
                <Text style={styles.headerSubtitle}>
                  {chat.online ? 'online' : chat.status || 'last seen recently'}
                </Text>
              </View>
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <BlurView intensity={120} tint="dark" style={styles.headerButtonBlur}>
              <View style={styles.headerButtonOverlay} />
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => searchVisible ? closeSearch() : openSearch()}
              >
                <Ionicons name="search" size={22} color={colors.text} />
              </TouchableOpacity>
            </BlurView>
            <BlurView intensity={120} tint="dark" style={styles.headerButtonBlur}>
              <View style={styles.headerButtonOverlay} />
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
        {searchVisible && (
          <Animated.View 
            style={[
              styles.searchBlockHeader,
              {
                opacity: searchBlockOpacity,
                transform: [{ translateY: searchBlockTranslateY }],
              },
            ]}
          >
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search messages..."
              autoFocus
              onClose={closeSearch}
            />
            {searchResults.length > 0 && (
              <BlurView intensity={120} tint="dark" style={styles.searchCounterBlur}>
                <View style={styles.searchCounterOverlay} />
                <View style={styles.searchCounter}>
                  <Text style={styles.searchCounterText}>
                    {currentSearchIndex + 1}/{searchResults.length}
                  </Text>
                  <TouchableOpacity onPress={handlePrevSearchResult} style={styles.searchNavButton}>
                    <Ionicons name="chevron-up" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextSearchResult} style={styles.searchNavButton}>
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </BlurView>
            )}
          </Animated.View>
        )}
      </View>
      <View style={styles.messagesContainer}>
        {wallpaperUri && (
          <>
            <Image 
              source={{ uri: wallpaperUri }} 
              style={[
                styles.wallpaperImage,
                {
                  opacity: wallpaperOpacity,
                }
              ]}
              resizeMode="cover"
              blurRadius={wallpaperBlur}
            />
            <View style={[styles.brightnessOverlay, { opacity: 1 - wallpaperBrightness }]} />
          </>
        )}
        <TouchableOpacity 
          style={styles.messagesListWrapper}
          activeOpacity={1}
          onPress={() => {
            if (searchVisible) {
              closeSearch();
            }
          }}
        >
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            onScrollBeginDrag={() => {
              if (searchVisible) {
                closeSearch();
              }
            }}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({ 
                  index: info.index, 
                  animated: true, 
                  viewPosition: 0.5 
                });
              }, 300);
            }}
            removeClippedSubviews={false}
            initialNumToRender={20}
            maxToRenderPerBatch={10}
            windowSize={21}
            ListHeaderComponent={<View style={{ height: 80 }} />}
            ListFooterComponent={<View style={{ height: 80 }} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="chatbubble-ellipses-outline" size={40} color={colors.textTertiary} />
                  </View>
                  <Text style={styles.emptyText}>No messages yet</Text>
                  <Text style={styles.emptySubtext}>Start a conversation</Text>
                </View>
              </View>
            }
          />
        </TouchableOpacity>
      </View>
      <Animated.View 
        style={[
          styles.inputContainerWrapper,
          {
            bottom: emojiPickerHeight,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.85)']}
          locations={[0, 0.2, 0.5, 1]}
          style={styles.inputGradient}
        />
        <View style={styles.inputContainer}>
          {isBlocked ? (
            <BlurView intensity={120} tint="dark" style={styles.blockedBlur}>
              <View style={styles.blockedOverlay} />
              <View style={styles.blockedContainer}>
                <Ionicons name="hand-left-outline" size={20} color={colors.error} />
                <Text style={styles.blockedText}>User is blocked</Text>
                <TouchableOpacity 
                  style={styles.unblockButton}
                  onPress={() => handleMenuOption('block')}
                >
                  <Text style={styles.unblockButtonText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          ) : (
            <>
              <BlurView intensity={120} tint="dark" style={styles.attachButtonBlur}>
                <View style={styles.inputButtonOverlay} />
                <TouchableOpacity style={styles.attachButton}>
                  <Ionicons name="attach" size={24} color={colors.text} />
                </TouchableOpacity>
              </BlurView>
              <BlurView intensity={120} tint="dark" style={styles.inputWrapperBlur}>
                <View style={styles.inputWrapperOverlay} />
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Message"
                    placeholderTextColor={colors.textTertiary}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    scrollEnabled={true}
                  />
                  <TouchableOpacity style={styles.emojiButton} onPress={() => {
                    if (emojiPickerVisible) {
                      closeEmojiPicker();
                    } else {
                      openEmojiPicker();
                    }
                  }}>
                    <Ionicons name="happy-outline" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </BlurView>
              <View style={styles.rightButtons}>
                {message.trim() ? (
                  <BlurView intensity={120} tint="dark" style={styles.sendButtonBlur}>
                    <View style={styles.sendButtonOverlay} />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                      <Ionicons name="send" size={20} color={colors.text} />
                    </TouchableOpacity>
                  </BlurView>
                ) : (
                  <Animated.View
                    style={[
                      styles.micButtonWrapper,
                      {
                        transform: [
                          { translateY: pan },
                          { scale: scale },
                        ],
                        opacity: opacity,
                      },
                    ]}
                    {...panResponder.panHandlers}
                  >
                    <BlurView intensity={120} tint="dark" style={styles.iconButtonBlur}>
                      <View style={styles.inputButtonOverlay} />
                      <TouchableOpacity style={styles.micButton}>
                        <Ionicons 
                          name={isMic ? "mic" : "camera"} 
                          size={24} 
                          color={colors.text} 
                        />
                      </TouchableOpacity>
                    </BlurView>
                  </Animated.View>
                )}
              </View>
            </>
          )}
        </View>
      </Animated.View>
      <Animated.View 
        style={[
          styles.emojiPickerContainer,
          {
            height: emojiPickerHeight,
          },
        ]}
      >
        {emojiPickerVisible && (
          <BlurView intensity={100} tint="dark" style={styles.emojiPickerBlur}>
            <View style={styles.emojiPickerOverlayStyle} />
            <View style={styles.emojiPickerContent}>
              <View style={styles.emojiCategories}>
                {Object.keys(emojiCategories).map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.emojiCategoryButton,
                      selectedEmojiCategory === key && styles.emojiCategoryButtonActive,
                    ]}
                    onPress={() => setSelectedEmojiCategory(key)}
                  >
                    <Ionicons
                      name={emojiCategories[key].icon}
                      size={22}
                      color={selectedEmojiCategory === key ? colors.text : colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {selectedEmojiCategory === 'gestures' && (
                <View style={styles.skinToneSelector}>
                  <TouchableOpacity 
                    style={[styles.skinToneButton, selectedSkinTone === '' && styles.skinToneButtonActive]}
                    onPress={() => setSelectedSkinTone('')}
                  >
                    <Text style={styles.skinToneEmoji}>👋</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.skinToneButton, selectedSkinTone === '🏻' && styles.skinToneButtonActive]}
                    onPress={() => setSelectedSkinTone('🏻')}
                  >
                    <Text style={styles.skinToneEmoji}>👋🏻</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.skinToneButton, selectedSkinTone === '🏼' && styles.skinToneButtonActive]}
                    onPress={() => setSelectedSkinTone('🏼')}
                  >
                    <Text style={styles.skinToneEmoji}>👋🏼</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.skinToneButton, selectedSkinTone === '🏽' && styles.skinToneButtonActive]}
                    onPress={() => setSelectedSkinTone('🏽')}
                  >
                    <Text style={styles.skinToneEmoji}>👋🏽</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.skinToneButton, selectedSkinTone === '🏾' && styles.skinToneButtonActive]}
                    onPress={() => setSelectedSkinTone('🏾')}
                  >
                    <Text style={styles.skinToneEmoji}>👋🏾</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.skinToneButton, selectedSkinTone === '🏿' && styles.skinToneButtonActive]}
                    onPress={() => setSelectedSkinTone('🏿')}
                  >
                    <Text style={styles.skinToneEmoji}>👋🏿</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.emojiSections}>
                {selectedEmojiCategory === 'recent' && recentEmojis.length > 0 && (
                  <View style={styles.emojiSection}>
                    <View style={styles.emojiSectionHeader}>
                      <Text style={styles.emojiSectionTitle}>RECENTLY USED</Text>
                      <TouchableOpacity onPress={() => setRecentEmojis([])}>
                        <Ionicons name="close" size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.emojiSectionGrid}>
                      {recentEmojis.map((emoji, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.emojiItem}
                          onPress={() => handleEmojiSelect(emoji)}
                        >
                          <Text style={styles.emojiText}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                {selectedEmojiCategory !== 'recent' && (
                  <View style={styles.emojiSection}>
                    <View style={styles.emojiSectionHeader}>
                      <Text style={styles.emojiSectionTitle}>
                        {emojiCategories[selectedEmojiCategory]?.name.toUpperCase()}
                      </Text>
                    </View>
                    <FlatList
                    data={displayEmojis}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.emojiItem}
                        onPress={() => handleEmojiSelect(item)}
                      >
                        <Text style={styles.emojiText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={8}
                    contentContainerStyle={styles.emojiGrid}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
                )}
              </View>
            </View>
          </BlurView>
        )}
      </Animated.View>
      <ChatMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectOption={handleMenuOption}
        isBlocked={isBlocked}
        chatId={chat.id}
        navigation={navigation}
      />
      {messageMenuVisible && (
        <View style={styles.messageMenuOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeMessageMenu}
          />
          {selectedMessage && (
            <Animated.View
              style={[
                styles.selectedMessagePreviewContainer,
                {
                  opacity: messageMenuOpacity,
                  transform: [{ scale: messageMenuScale }],
                },
              ]}
            >
              <View style={[styles.selectedMessagePreview, { backgroundColor: selectedMessage.isMine ? chatColor : 'rgba(44, 44, 46, 0.8)' }]}>
                <Text style={styles.selectedMessageText} numberOfLines={3}>
                  {selectedMessage.text}
                </Text>
                <View style={styles.selectedMessageFooter}>
                  <Text style={styles.selectedMessageTime}>{selectedMessage.time}</Text>
                  {selectedMessage.isMine && <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" />}
                </View>
              </View>
            </Animated.View>
          )}
          <Animated.View
            style={[
              styles.reactionsBarContainer,
              {
                opacity: messageMenuOpacity,
                transform: [{ scale: messageMenuScale }],
              },
            ]}
          >
            <BlurView intensity={80} tint="dark" style={styles.reactionsBar}>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('🤍')}>
                <Text style={styles.reactionEmoji}>🤍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('❤️')}>
                <Text style={styles.reactionEmoji}>❤️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('🤍')}>
                <Text style={styles.reactionEmoji}>🤍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('❤️')}>
                <Text style={styles.reactionEmoji}>❤️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('👍')}>
                <Text style={styles.reactionEmoji}>👍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('👎')}>
                <Text style={styles.reactionEmoji}>👎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('🔥')}>
                <Text style={styles.reactionEmoji}>🔥</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionMoreButton}>
                <Ionicons name="chevron-down" size={20} color={colors.text} />
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
          <Animated.View
            style={[
              styles.actionMenuContainer,
              {
                opacity: messageMenuOpacity,
                transform: [{ scale: messageMenuScale }],
              },
            ]}
          >
            <BlurView intensity={80} tint="dark" style={styles.actionMenu}>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleMessageAction('reply')}>
                <Ionicons name="arrow-undo" size={18} color={colors.text} />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleMessageAction('copy')}>
                <Ionicons name="copy-outline" size={18} color={colors.text} />
                <Text style={styles.actionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleMessageAction('edit')}>
                <Ionicons name="create-outline" size={18} color={colors.text} />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleMessageAction('pin')}>
                <Ionicons name="pin-outline" size={18} color={colors.text} />
                <Text style={styles.actionText}>Pin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleMessageAction('forward')}>
                <Ionicons name="arrow-redo" size={18} color={colors.text} />
                <Text style={styles.actionText}>Forward</Text>
              </TouchableOpacity>
              <View style={styles.actionDivider} />
              <TouchableOpacity style={styles.actionItem} onPress={() => handleMessageAction('delete')}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
                <Text style={[styles.actionText, styles.actionTextDanger]}>Delete</Text>
              </TouchableOpacity>
              <View style={styles.actionDivider} />
              <TouchableOpacity style={styles.actionItem} onPress={() => handleMessageAction('select')}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.text} />
                <Text style={styles.actionText}>Select</Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: -1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 54,
    paddingBottom: 10,
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  headerButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBadgeWrapper: {
    position: 'absolute',
    top: -2,
    left: 28,
    zIndex: 10,
  },
  backBadge: {
    backgroundColor: colors.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: 'rgba(18, 18, 20, 0.9)',
  },
  backBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: typography.bold,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    position: 'relative',
  },
  headerAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  headerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  headerAvatarText: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
  headerCenterWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerCenterBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerCenterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  headerCenter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 1,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBlockHeader: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 12,
    marginTop: -4,
    backgroundColor: 'transparent',
  },
  searchCounterBlur: {
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  searchCounterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  searchCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchCounterText: {
    fontSize: 13,
    color: colors.text,
    fontFamily: typography.medium,
  },
  searchNavButton: {
    padding: 4,
  },
  searchResult: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  currentSearchResult: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  messagesContainer: {
    flex: 1,
    position: 'relative',
  },
  messagesListWrapper: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  wallpaperImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  brightnessOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  wallpaperGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wallpaperGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  wallpaperSolid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 280,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 17,
    color: colors.text,
    fontFamily: typography.semiBold,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: typography.medium,
    backgroundColor: 'rgba(44, 44, 46, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  channelMessage: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  channelAvatarText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.medium,
  },
  channelContent: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  channelName: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  channelViews: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  channelDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  channelText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  forwardButton: {
    padding: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageAvatarText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.medium,
  },
  incomingBubble: {
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    maxWidth: '70%',
  },
  senderName: {
    fontSize: 14,
    fontFamily: typography.semiBold,
    color: '#ff6b9d',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
  },
  myMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  myMessageBubble: {
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 12,
    maxWidth: '70%',
  },
  myMessageText: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  myMessageTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  imageMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  imageMessage: {
    width: 280,
    height: 400,
    borderRadius: 16,
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
    overflow: 'hidden',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDownload: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  inputGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: -1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  inputButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapperBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  inputWrapperOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    minHeight: 40,
  },
  emojiButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    margin: 0,
    includeFontPadding: false,
    minHeight: 20,
    maxHeight: 120,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  micButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sendButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedBlur: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  blockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
  },
  blockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  blockedText: {
    fontSize: 15,
    color: colors.error,
    fontFamily: typography.medium,
  },
  unblockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.error,
    borderRadius: 16,
  },
  unblockButtonText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: typography.semiBold,
  },
  messageMenuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  selectedMessagePreviewContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.50,
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.70,
    maxWidth: 330,
  },
  selectedMessagePreview: {
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedMessageText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: typography.regular,
    marginBottom: 5,
    lineHeight: 19,
  },
  selectedMessageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  selectedMessageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: typography.regular,
  },
  reactionsBarContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    alignSelf: 'center',
  },
  reactionsBar: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 26,
    paddingHorizontal: 3,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  reactionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 24,
  },
  reactionMoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(60, 60, 67, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionMenuContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.15,
    right: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.58,
    maxWidth: 270,
  },
  actionMenu: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    color: colors.text,
    fontFamily: typography.regular,
  },
  actionTextDanger: {
    color: colors.error,
  },
  actionDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 1,
    marginHorizontal: 14,
  },
  emojiPickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  emojiPickerBlur: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'rgba(28, 28, 30, 0.98)',
  },
  emojiPickerOverlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  emojiPickerContent: {
    flex: 1,
    paddingTop: 8,
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  emojiPickerTitle: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emojiPickerClose: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiCategories: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingBottom: 8,
    paddingTop: 4,
    gap: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'space-evenly',
  },
  emojiCategoryButton: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 2,
  },
  emojiCategoryButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  skinToneSelector: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  skinToneButton: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  skinToneButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skinToneEmoji: {
    fontSize: 20,
  },
  emojiSections: {
    flex: 1,
  },
  emojiSection: {
    marginBottom: 16,
  },
  emojiSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  emojiSectionTitle: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  emojiSectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  emojiGrid: {
    paddingHorizontal: 2,
    paddingBottom: 12,
  },
  emojiItem: {
    width: SCREEN_WIDTH / 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  emojiText: {
    fontSize: 24,
  },
});
