import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useInitialData } from '../hooks/useInitialData';

export default function ChatsScreen({ navigation }) {
  useInitialData();
  const { chats, archivedChats, deleteChat, archiveChat } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const handleDeleteChat = (chatId) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteChat(chatId) },
      ]
    );
  };

  const handleArchiveChat = (chatId) => {
    archiveChat(chatId);
  };

  const renderChat = ({ item }) => (
    <View style={styles.chatItemWrapper}>
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', { chat: item })}
        activeOpacity={0.6}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
          {item.online && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <View style={styles.nameRow}>
              <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
            </View>
            <View style={styles.timeRow}>
              {item.isYou && <Ionicons name="checkmark-done" size={16} color={colors.primary} style={{ marginRight: 4 }} />}
              <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>
                {item.time}
              </Text>
            </View>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.lastMessage}
            </Text>
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
          {item.tags && (
            <View style={styles.tagsRow}>
              {item.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
            </View>
          )}
        </View>
        {item.pinned && <View style={styles.pinnedIndicator} />}
      </TouchableOpacity>
      
      {isEditMode && (
        <View style={styles.editActions}>
          <TouchableOpacity
            style={styles.editActionButton}
            onPress={() => handleArchiveChat(item.id)}
          >
            <Ionicons name="archive-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editActionButton, styles.deleteButton]}
            onPress={() => handleDeleteChat(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <BlurView intensity={20} tint="dark" style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditMode(!isEditMode)}
            >
              <Text style={styles.editButtonText}>{isEditMode ? 'Done' : 'Edit'}</Text>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Chats</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Contacts')}
              >
                <Ionicons name="add" size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="create-outline" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </View>

      {archivedChats.length > 0 && (
        <TouchableOpacity 
          style={styles.archivedChats}
          onPress={() => navigation.navigate('ArchivedChats')}
        >
          <View style={styles.archivedIcon}>
            <Ionicons name="archive-outline" size={28} color="#000000" />
          </View>
          <View style={styles.archivedContent}>
            <Text style={styles.archivedTitle}>Archived Chats</Text>
            <Text style={styles.archivedSubtitle} numberOfLines={1}>
              {archivedChats.map(c => c.name).join(', ')}
            </Text>
          </View>
          <View style={styles.archivedRight}>
            <View style={styles.archivedBadge}>
              <Text style={styles.archivedBadgeText}>{archivedChats.length}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
  },
  headerBlur: {
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  editButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
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
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  archivedChats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  archivedIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  archivedContent: {
    flex: 1,
  },
  archivedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  archivedSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  archivedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  archivedBadge: {
    backgroundColor: colors.textSecondary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  archivedBadgeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  chatItemWrapper: {
    position: 'relative',
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  editActions: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    flexDirection: 'row',
    gap: 8,
  },
  editActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.online,
    borderWidth: 3,
    borderColor: colors.background,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chatTimeUnread: {
    color: colors.primary,
    fontWeight: '500',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: colors.badge,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  pinnedIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    position: 'absolute',
    right: 16,
    top: '50%',
  },
});
