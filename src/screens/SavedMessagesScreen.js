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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const SAVED_MESSAGES_CHAT_ID = 'saved_messages';

export default function SavedMessagesScreen({ navigation }) {
  const { messages, addMessage } = useApp();
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);
  
  const savedMessages = messages[SAVED_MESSAGES_CHAT_ID] || [];

  useEffect(() => {
    if (flatListRef.current && savedMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [savedMessages.length]);

  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage(SAVED_MESSAGES_CHAT_ID, message.trim());
      setMessage('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderDateSeparator = (date) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );

  const renderMessage = ({ item, index }) => {
    const showDate = index === 0 || savedMessages[index - 1]?.dateGroup !== item.dateGroup;
    
    return (
      <>
        {showDate && renderDateSeparator(item.dateGroup)}
        
        <View style={styles.myMessageContainer}>
          <View style={styles.myMessageBubble}>
            <Text style={styles.myMessageText}>{item.text}</Text>
            <View style={styles.myMessageFooter}>
              <Text style={styles.myMessageTime}>{item.time}</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Saved Messages</Text>
          </View>

          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={savedMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No saved messages yet</Text>
              <Text style={styles.emptySubtext}>
                Save important messages, links, and notes here
              </Text>
            </View>
          }
        />
      </View>

      <BlurView intensity={80} tint="dark" style={styles.inputContainer}>
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
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  headerButton: {
    marginLeft: 16,
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
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 8,
    textAlign: 'center',
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
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderTopWidth: 0.5,
    borderTopColor: colors.separator,
    alignItems: 'flex-end',
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
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
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
