import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

export default function MessageBubble({ message, isOwn }) {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View style={[
        styles.bubble,
        isOwn ? styles.ownBubble : styles.otherBubble,
        { backgroundColor: isOwn ? theme.messageBubbleOwn : theme.messageBubbleOther }
      ]}>
        {message.replyTo && (
          <View style={[styles.replyContainer, { 
            borderLeftColor: isOwn ? 'rgba(255,255,255,0.5)' : theme.primary,
            backgroundColor: isOwn ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)'
          }]}>
            <Text style={[styles.replyName, { color: isOwn ? 'rgba(255,255,255,0.9)' : theme.primary }]}>Вы</Text>
            <Text style={[styles.replyText, { color: isOwn ? 'rgba(255,255,255,0.7)' : theme.textSecondary }]} numberOfLines={1}>
              {message.replyTo.text}
            </Text>
          </View>
        )}
        
        <Text style={[styles.text, { color: isOwn ? theme.messageTextOwn : theme.messageTextOther }]}>
          {message.text}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.time, { color: isOwn ? 'rgba(255,255,255,0.6)' : theme.textSecondary }]}>
            {formatTime(message.createdAt)}
          </Text>
          {isOwn && (
            <View style={styles.statusContainer}>
              {message.isRead ? (
                <View style={styles.doubleCheck}>
                  <Text style={[styles.checkmark, { color: theme.success }]}>✓</Text>
                  <Text style={[styles.checkmark, styles.checkmarkSecond, { color: theme.success }]}>✓</Text>
                </View>
              ) : (
                <Text style={[styles.checkmark, { color: 'rgba(255,255,255,0.6)' }]}>✓</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 2, paddingHorizontal: 8, maxWidth: '80%', alignSelf: 'flex-start' },
  ownContainer: { alignSelf: 'flex-end' },
  bubble: { paddingHorizontal: 10, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  ownBubble: { borderRadius: 12, borderBottomRightRadius: 2 },
  otherBubble: { borderRadius: 12, borderBottomLeftRadius: 2, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.05)' },
  replyContainer: { borderLeftWidth: 2, paddingLeft: 8, paddingVertical: 4, marginBottom: 4, borderRadius: 2 },
  replyName: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  replyText: { fontSize: 13 },
  text: { fontSize: 16, lineHeight: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 2, alignSelf: 'flex-end', gap: 3 },
  time: { fontSize: 11 },
  statusContainer: { marginLeft: 2 },
  doubleCheck: { flexDirection: 'row', position: 'relative' },
  checkmark: { fontSize: 12, fontWeight: '700' },
  checkmarkSecond: { marginLeft: -5 },
});
