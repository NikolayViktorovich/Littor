import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { Avatar } from '../components/Avatar';
export default function ArchivedChatsScreen({ navigation }) {
  const { archivedChats, unarchiveChat, deleteChat } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return archivedChats;
    return archivedChats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [archivedChats, searchQuery]);
  const handleUnarchive = (chatId) => {
    unarchiveChat(chatId);
    Alert.alert('Готово', 'Чат разархивирован');
  };
  const handleDelete = (chatId) => {
    Alert.alert(
      'Удалить чат',
      'Вы уверены, что хотите удалить этот чат?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive', 
          onPress: () => deleteChat(chatId) 
        },
      ]
    );
  };
  const renderChat = ({ item }) => (
    <View style={styles.chatItemWrapper}>
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', { chat: item })}
        activeOpacity={0.6}
      >
        <Avatar name={item.name} size={52} online={item.online} style={{ marginRight: 12 }} />
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
        </View>
      </TouchableOpacity>
      {isEditMode && (
        <View style={styles.editActions}>
          <TouchableOpacity
            style={styles.editActionButton}
            onPress={() => handleUnarchive(item.id)}
          >
            <Ionicons name="arrow-undo" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editActionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Архивные чаты</Text>
            <Text style={styles.headerSubtitle}>{archivedChats.length} чатов</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Text style={styles.editButtonText}>{isEditMode ? 'Готово' : 'Править'}</Text>
          </TouchableOpacity>
        </View>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск архивных чатов"
          style={styles.searchBar}
        />
      </View>
      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="archive" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyText}>Нет архивных чатов</Text>
            <Text style={styles.emptySubtext}>
              Архивные чаты появятся здесь
            </Text>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 90,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 30,
  },
  editButtonText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.medium,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
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
    fontFamily: typography.medium,
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
    fontFamily: typography.medium,
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
    borderRadius: 24.0,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: typography.semiBold,
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
    borderRadius: 30,
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
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
    fontFamily: typography.medium,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 8,
    textAlign: 'center',
  },
});
