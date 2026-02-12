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
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
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
  const flatListRef = useRef(null);
  
  const chatMessages = messages[chat.id] || [];
  const currentChat = chats.find(c => c.id === chat.id) || chat;
  const isBlocked = currentChat.blocked || false;

  // Поиск по сообщениям
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
    if (flatListRef.current && index >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }, 100);
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
    setSearchVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
  };

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
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleMenuOption = (option) => {
    switch (option) {
      case 'wallpaper':
        Alert.alert('Change Wallpaper', 'Wallpaper customization coming soon!');
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
          // Свайп вверх - переключаем с анимацией
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
          // Возвращаем на место
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
    
    return (
      <>
        {showDate && renderDateSeparator(item.dateGroup)}
        
        {item.type === 'channel' ? (
          <View style={styles.channelMessage}>
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
          </View>
        ) : item.image ? (
          <View style={styles.imageMessageContainer}>
            <View style={styles.imageMessage}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image" size={60} color={colors.textSecondary} />
              </View>
              <TouchableOpacity style={styles.imageDownload}>
                <Ionicons name="chevron-down" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        ) : item.sender ? (
          <View style={styles.messageContainer}>
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>{item.avatar}</Text>
            </View>
            <View style={[styles.incomingBubble, isHighlighted && !isCurrentResult && styles.searchResult, isCurrentResult && styles.currentSearchResult]}>
              <Text style={styles.senderName}>{item.sender}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          </View>
        ) : item.isMine && item.text ? (
          <View style={styles.myMessageContainer}>
            <View style={[
              styles.myMessageBubble,
              isCurrentResult && styles.currentSearchResult,
              isHighlighted && !isCurrentResult && styles.searchResult,
            ]}>
              <Text style={styles.myMessageText}>{item.text}</Text>
              <View style={styles.myMessageFooter}>
                <Text style={styles.myMessageTime}>{item.time}</Text>
                {item.hasCheck && <Ionicons name="checkmark-done" size={16} color="rgba(255,255,255,0.7)" />}
              </View>
            </View>
          </View>
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
      <BlurView intensity={80} tint="dark" style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
            <View style={styles.backBadge}>
              <Text style={styles.backBadgeText}>6</Text>
            </View>
          </TouchableOpacity>
          
          {searchVisible ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search messages..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchResults.length > 0 && (
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
              )}
              <TouchableOpacity onPress={closeSearch} style={styles.closeSearchButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{chat.name}</Text>
                {isBlocked ? (
                  <Text style={styles.headerSubtitle}>blocked</Text>
                ) : chat.online ? (
                  <Text style={styles.headerSubtitle}>online</Text>
                ) : null}
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => setSearchVisible(true)}
                >
                  <Ionicons name="search" size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => setMenuVisible(true)}
                >
                  <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </BlurView>

      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start a conversation</Text>
            </View>
          }
        />
      </View>

      <BlurView intensity={80} tint="dark" style={styles.inputContainer}>
        {isBlocked ? (
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
        ) : (
          <>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={24} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Message"
                placeholderTextColor={colors.textTertiary}
                value={message}
                onChangeText={setMessage}
                multiline
                scrollEnabled={false}
              />
            </View>

            <View style={styles.rightButtons}>
              {message.trim() ? (
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Ionicons name="send" size={20} color={colors.text} />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="gift-outline" size={24} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="time-outline" size={24} color={colors.text} />
                  </TouchableOpacity>
                  <Animated.View
                    style={[
                      styles.micButton,
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
                    <TouchableOpacity style={styles.micButtonInner}>
                      <Ionicons 
                        name={isMic ? "mic" : "camera"} 
                        size={24} 
                        color={colors.text} 
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </>
              )}
            </View>
          </>
        )}
      </BlurView>

      <ChatMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectOption={handleMenuOption}
        isBlocked={isBlocked}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
  },
  backBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.textSecondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  backBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  searchCounterText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 4,
  },
  searchNavButton: {
    padding: 4,
  },
  closeSearchButton: {
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
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 8,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
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
    fontWeight: '500',
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
    fontWeight: '600',
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
    fontWeight: '500',
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
    fontWeight: '600',
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 12,
    maxWidth: '70%',
  },
  myMessageText: {
    fontSize: 15,
    color: '#000000',
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
    color: 'rgba(0, 0, 0, 0.6)',
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
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    paddingBottom: 12,
    borderTopWidth: 0,
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 30, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
    minHeight: 40,
    maxHeight: 100,
  },
  input: {
    color: colors.text,
    fontSize: 16,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    minHeight: 20,
    maxHeight: 80,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 2,
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  blockedText: {
    fontSize: 15,
    color: colors.error,
    fontWeight: '500',
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
    fontWeight: '600',
  },
});
