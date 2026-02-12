import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
const CHAT_COLORS = [
  { id: '1', color: '#FF3B30', name: 'Red' },
  { id: '2', color: '#FF9500', name: 'Orange' },
  { id: '3', color: '#FFCC00', name: 'Yellow' },
  { id: '4', color: '#34C759', name: 'Green' },
  { id: '5', color: '#00C7BE', name: 'Teal' },
  { id: '6', color: '#32ADE6', name: 'Blue' },
  { id: '7', color: '#007AFF', name: 'Dark Blue' },
  { id: '8', color: '#5856D6', name: 'Purple' },
  { id: '9', color: '#AF52DE', name: 'Violet' },
  { id: '10', color: '#FF2D55', name: 'Pink' },
  { id: '11', color: '#A2845E', name: 'Brown' },
  { id: '12', color: '#8E8E93', name: 'Gray' },
];
export default function ChatColorScreen({ route, navigation }) {
  const { chatId } = route.params;
  const { chats, updateChatColor } = useApp();
  const chat = chats.find(c => c.id === chatId);
  const [selectedColor, setSelectedColor] = useState(chat?.chatColor || '#007AFF');
  const handleSave = () => {
    updateChatColor(chatId, selectedColor);
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Color</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewSection}>
          <View style={styles.previewChat}>
            <View style={styles.previewBubbleIncoming}>
              <Text style={styles.previewTextIncoming}>Hey! How's it going?</Text>
              <Text style={styles.previewTime}>12:30</Text>
            </View>
            <View style={[styles.previewBubbleOwn, { backgroundColor: selectedColor }]}>
              <Text style={styles.previewTextOwn}>Great! Just working on some stuff</Text>
              <View style={styles.previewFooter}>
                <Text style={styles.previewTimeOwn}>12:31</Text>
                <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" />
              </View>
            </View>
            <View style={styles.previewBubbleIncoming}>
              <Text style={styles.previewTextIncoming}>Nice! 👍</Text>
              <Text style={styles.previewTime}>12:31</Text>
            </View>
          </View>
        </View>
        <View style={styles.colorsSection}>
          <Text style={styles.sectionTitle}>SELECT COLOR</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorsScroll}
          >
            {CHAT_COLORS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.colorItem}
                onPress={() => setSelectedColor(item.color)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.colorCircle, 
                  { backgroundColor: item.color },
                  selectedColor === item.color && styles.colorCircleSelected
                ]}>
                  {selectedColor === item.color && (
                    <Ionicons name="checkmark" size={24} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: typography.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  previewSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  previewChat: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  previewBubbleIncoming: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: '75%',
  },
  previewBubbleOwn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
    maxWidth: '75%',
  },
  previewTextIncoming: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  previewTextOwn: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 2,
  },
  previewTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  previewTimeOwn: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  colorsSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: typography.bold,
    color: colors.textSecondary,
    marginBottom: 16,
    paddingHorizontal: 16,
    letterSpacing: 0.5,
  },
  colorsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  colorItem: {
    alignItems: 'center',
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: colors.text,
    transform: [{ scale: 1.05 }],
  },
});
