import { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useInitialData } from '../hooks/useInitialData';
import CustomAlert from '../components/CustomAlert';
import { SearchBar } from '../components/SearchBar';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function ChatsScreen({ navigation }) {
  useInitialData();
  const { chats, archivedChats, deleteChat, archiveChat, messages } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewChat, setPreviewChat] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', buttons: [] });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);
  const handleDeleteChat = (chatId) => {
    setAlertConfig({
      visible: true,
      title: 'Delete Chat',
      message: 'Are you sure you want to delete this chat?',
      icon: 'trash',
      iconColor: colors.error,
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteChat(chatId) 
        },
      ],
    });
  };
  const handleArchiveChat = (chatId) => {
    archiveChat(chatId);
  };
  const handleLongPress = (chat) => {
    setPreviewChat(chat);
    setPreviewVisible(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closePreview = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPreviewVisible(false);
      setPreviewChat(null);
    });
  };
  const handlePreviewAction = (action) => {
    closePreview();
    setTimeout(() => {
      switch (action) {
        case 'addContact':
          break;
        case 'addFolder':
          break;
        case 'markUnread':
          break;
        case 'pin':
          break;
        case 'mute':
          break;
        case 'delete':
          handleDeleteChat(previewChat?.id);
          break;
      }
    }, 300);
  };
  const renderChat = ({ item }) => (
    <View style={styles.chatItemWrapper}>
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', { chat: item })}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.6}
        delayLongPress={500}
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
        </BlurView>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
        style={styles.searchBar}
      />
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
      <Modal
        visible={previewVisible}
        transparent
        animationType="none"
        onRequestClose={closePreview}
      >
        <TouchableOpacity 
          style={styles.previewOverlay}
          activeOpacity={1}
          onPress={closePreview}
        >
          <Animated.View style={[styles.previewBackdrop, { opacity: opacityAnim }]} />
        </TouchableOpacity>
        <Animated.View 
          style={[
            styles.previewContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          {previewChat && (
            <>
              <View style={styles.previewHeader}>
                <TouchableOpacity style={styles.previewBackButton} onPress={closePreview}>
                  <Ionicons name="chevron-back" size={24} color={colors.text} />
                  <View style={styles.previewBackBadge}>
                    <Text style={styles.previewBackBadgeText}>6</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.previewHeaderCenter}>
                  <Text style={styles.previewName}>{previewChat.name}</Text>
                  <Text style={styles.previewStatus}>
                    {previewChat.online ? 'online' : 'last seen 1 hour ago'}
                  </Text>
                </View>
                <View style={styles.previewAvatar}>
                  <Text style={styles.previewAvatarText}>
                    {previewChat.name[0].toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.previewMessages}>
                <View style={styles.previewDateSeparator}>
                  <Text style={styles.previewDateText}>26.06.2026</Text>
                  <View style={styles.previewMessageInfo}>
                    <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.previewMessageInfoText}>45</Text>
                    <Text style={styles.previewMessageInfoText}>17:48</Text>
                    <Ionicons name="share-outline" size={14} color={colors.textSecondary} />
                  </View>
                </View>
                {messages[previewChat.id]?.slice(-3).map((msg, index) => (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.previewMessage,
                      msg.isMine && styles.previewMessageMine
                    ]}
                  >
                    <View style={[
                      styles.previewMessageBubble,
                      msg.isMine && styles.previewMessageBubbleMine
                    ]}>
                      {!msg.isMine && (
                        <Text style={styles.previewMessageSender}>{previewChat.name}</Text>
                      )}
                      <Text style={styles.previewMessageText}>{msg.text}</Text>
                      <View style={styles.previewMessageFooter}>
                        {msg.edited && (
                          <Text style={styles.previewMessageEdited}>edited</Text>
                        )}
                        <Text style={styles.previewMessageTime}>{msg.time}</Text>
                        {msg.isMine && msg.hasCheck && (
                          <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" />
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.View>
        <Animated.View 
          style={[
            styles.previewMenuContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          {previewChat && (
            <BlurView intensity={80} tint="dark" style={styles.previewMenu}>
              <TouchableOpacity 
                style={styles.previewMenuItem}
                onPress={() => handlePreviewAction('addContact')}
              >
                <Ionicons name="person-add-outline" size={20} color={colors.text} />
                <Text style={styles.previewMenuText}>Add to Contacts</Text>
              </TouchableOpacity>
              <View style={styles.previewMenuDivider} />
              <TouchableOpacity 
                style={styles.previewMenuItem}
                onPress={() => handlePreviewAction('addFolder')}
              >
                <Ionicons name="folder-outline" size={20} color={colors.text} />
                <Text style={styles.previewMenuText}>Add to Folder</Text>
              </TouchableOpacity>
              <View style={styles.previewMenuDivider} />
              <TouchableOpacity 
                style={styles.previewMenuItem}
                onPress={() => handlePreviewAction('markUnread')}
              >
                <Ionicons name="mail-unread-outline" size={20} color={colors.text} />
                <Text style={styles.previewMenuText}>Mark as Unread</Text>
              </TouchableOpacity>
              <View style={styles.previewMenuDivider} />
              <TouchableOpacity 
                style={styles.previewMenuItem}
                onPress={() => handlePreviewAction('pin')}
              >
                <Ionicons name="pin-outline" size={20} color={colors.text} />
                <Text style={styles.previewMenuText}>Pin</Text>
              </TouchableOpacity>
              <View style={styles.previewMenuDivider} />
              <TouchableOpacity 
                style={styles.previewMenuItem}
                onPress={() => handlePreviewAction('mute')}
              >
                <Ionicons name="notifications-off-outline" size={20} color={colors.text} />
                <Text style={styles.previewMenuText}>Mute</Text>
              </TouchableOpacity>
              <View style={styles.previewMenuDivider} />
              <TouchableOpacity 
                style={styles.previewMenuItem}
                onPress={() => handlePreviewAction('delete')}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text style={[styles.previewMenuText, styles.previewMenuTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </BlurView>
          )}
        </Animated.View>
      </Modal>
      <CustomAlert
        visible={alertConfig.visible}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        iconColor={alertConfig.iconColor}
        buttons={alertConfig.buttons}
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
    fontFamily: typography.medium,
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
    fontFamily: typography.semiBold,
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
    fontFamily: typography.semiBold,
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
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
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
    fontFamily: typography.medium,
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
    fontFamily: typography.semiBold,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: typography.medium,
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
  previewOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  previewContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.92,
    height: SCREEN_HEIGHT * 0.45,
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    top: SCREEN_HEIGHT * 0.08,
    left: SCREEN_WIDTH * 0.04,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingTop: 16,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  previewBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  previewBackBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.textSecondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  previewBackBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: typography.semiBold,
  },
  previewHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAvatarText: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: '#000000',
  },
  previewHeaderInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 2,
  },
  previewStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewMessages: {
    flex: 1,
    padding: 12,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  previewDateSeparator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewDateText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  previewMessageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewMessageInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewMessage: {
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  previewMessageMine: {
    alignItems: 'flex-end',
  },
  previewMessageBubble: {
    backgroundColor: 'rgba(44, 44, 46, 0.9)',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    maxWidth: '80%',
  },
  previewMessageBubbleMine: {
    backgroundColor: '#8B5CF6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  previewMessageSender: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    color: '#FF6B9D',
    marginBottom: 4,
  },
  previewMessageText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 19,
    marginBottom: 4,
  },
  previewMessageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  previewMessageEdited: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  previewMessageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  previewMenuContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.65,
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    bottom: SCREEN_HEIGHT * 0.15,
    right: SCREEN_WIDTH * 0.06,
  },
  previewMenu: {
    paddingVertical: 6,
    overflow: 'hidden',
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  previewMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  previewMenuDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 34,
  },
  previewMenuItemDanger: {
    borderTopWidth: 0,
  },
  previewMenuText: {
    fontSize: 15,
    color: colors.text,
  },
  previewMenuTextDanger: {
    color: colors.error,
  },
});
