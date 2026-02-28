import React, { useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 86400000) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

export default function SwipeableChat({ chat, onPress, onDelete, onPin, onMute }) {
  const { theme } = useContext(ThemeContext);
  const swipeableRef = useRef(null);

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#34C759' }]} onPress={() => { onPin(); swipeableRef.current?.close(); }}>
        <Ionicons name="pin" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF9500' }]} onPress={() => { onMute(); swipeableRef.current?.close(); }}>
        <Ionicons name="notifications-off" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF3B30' }]} onPress={onDelete}>
        <Ionicons name="trash" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false} friction={2}>
      <TouchableOpacity style={[styles.container, { backgroundColor: theme.background }]} onPress={onPress} activeOpacity={0.7}>
        {chat.isPinned && <View style={[styles.pinnedIndicator, { backgroundColor: theme.primary }]} />}
        
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{chat.name[0].toUpperCase()}</Text>
          </View>
          {chat.online && <View style={[styles.onlineBadge, { backgroundColor: theme.success, borderColor: theme.background }]} />}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{chat.name}</Text>
            <View style={styles.timeContainer}>
              {chat.isMuted && <Ionicons name="notifications-off" size={14} color={theme.textSecondary} style={styles.mutedIcon} />}
              {chat.lastMessageTime && <Text style={[styles.time, { color: theme.textSecondary }]}>{formatTime(chat.lastMessageTime)}</Text>}
            </View>
          </View>
          
          <View style={styles.footer}>
            {chat.isTyping ? (
              <Text style={[styles.typing, { color: theme.primary }]}>печатает...</Text>
            ) : (
              <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
                {chat.lastMessage || 'Нет сообщений'}
              </Text>
            )}
            {chat.unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: chat.isMuted ? theme.textSecondary : theme.primary }]}>
                <Text style={styles.badgeText}>{chat.unreadCount > 99 ? '99+' : chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  pinnedIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '600', flex: 1, marginRight: 8 },
  timeContainer: { flexDirection: 'row', alignItems: 'center' },
  mutedIcon: { marginRight: 4 },
  time: { fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 15, flex: 1, marginRight: 8 },
  typing: { fontSize: 15, fontStyle: 'italic', flex: 1 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  actionsContainer: { flexDirection: 'row' },
  actionButton: { width: 70, justifyContent: 'center', alignItems: 'center' },
});
