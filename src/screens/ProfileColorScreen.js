import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
const { width } = Dimensions.get('window');
const PROFILE_COLORS = [
  { id: '1', color: '#007AFF', name: 'Blue', type: 'solid' },
  { id: '2', color: '#34C759', name: 'Green', type: 'solid' },
  { id: '3', color: '#FF9500', name: 'Orange', type: 'solid' },
  { id: '4', color: '#FF3B30', name: 'Red', type: 'solid' },
  { id: '5', color: '#5856D6', name: 'Purple', type: 'solid' },
  { id: '6', color: '#00C7BE', name: 'Teal', type: 'solid' },
  { id: '7', color: '#FF2D55', name: 'Pink', type: 'solid' },
  { id: '8', color: '#32ADE6', name: 'Sky Blue', type: 'gradient', gradient: ['#32ADE6', '#007AFF'] },
  { id: '9', color: '#34C759', name: 'Lime', type: 'gradient', gradient: ['#8BC34A', '#34C759'] },
  { id: '10', color: '#FF9500', name: 'Sunset', type: 'gradient', gradient: ['#FFB84D', '#FF9500'] },
  { id: '11', color: '#FF6B6B', name: 'Coral', type: 'gradient', gradient: ['#FF8A80', '#FF6B6B'] },
  { id: '12', color: '#AF52DE', name: 'Violet', type: 'gradient', gradient: ['#C77FE8', '#AF52DE'] },
  { id: '13', color: '#00C7BE', name: 'Aqua', type: 'gradient', gradient: ['#4DD9D1', '#00C7BE'] },
  { id: '14', color: '#FF2D55', name: 'Rose', type: 'gradient', gradient: ['#FF6B8A', '#FF2D55'] },
  { id: '15', color: '#FF6B6B', name: 'Rainbow 1', type: 'special', gradient: ['#FF6B6B', '#4ECDC4', '#45B7D1'] },
  { id: '16', color: '#FFD93D', name: 'Rainbow 2', type: 'special', gradient: ['#FFD93D', '#6BCF7F', '#4D96FF'] },
  { id: '17', color: '#FF6B9D', name: 'Rainbow 3', type: 'special', gradient: ['#FF6B9D', '#C44569', '#FFA07A'] },
  { id: '18', color: '#4FACFE', name: 'Rainbow 4', type: 'special', gradient: ['#4FACFE', '#00F2FE', '#43E97B'] },
  { id: '19', color: '#FA709A', name: 'Rainbow 5', type: 'special', gradient: ['#FA709A', '#FEE140', '#30CFD0'] },
  { id: '20', color: '#A8EDEA', name: 'Rainbow 6', type: 'special', gradient: ['#A8EDEA', '#FED6E3', '#FFB6C1'] },
  { id: '21', color: '#667EEA', name: 'Rainbow 7', type: 'special', gradient: ['#667EEA', '#764BA2', '#F093FB'] },
];
export default function ProfileColorScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const [selectedColor, setSelectedColor] = useState(profile.profileColor || '#FF3B30');
  const handleSave = () => {
    updateProfile({ profileColor: selectedColor });
    navigation.goBack();
  };
  const selectedColorData = PROFILE_COLORS.find(c => c.color === selectedColor);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Color</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.previewCard}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { backgroundColor: selectedColor }]}>
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{profile.avatar}</Text>
              )}
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileStatus}>online</Text>
          </View>
          <View style={styles.messagesPreview}>
            <View style={[styles.messageBox, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Text style={[styles.messageName, { color: selectedColor }]}>{profile.name}</Text>
              <Text style={styles.messageText}>Reply to your message</Text>
            </View>
            <View style={styles.messageDescription}>
              <Text style={styles.descriptionText}>
                Your name and replies to your messages will be shown in the selected color.
              </Text>
            </View>
            <View style={[styles.messageBox, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Text style={styles.messageLinkTitle}>Link Preview</Text>
              <Text style={styles.messageText}>
                Previews of links you send will also use this color.
              </Text>
              <Text style={styles.messageTime}>23:20</Text>
            </View>
          </View>
          <View style={styles.colorsGrid}>
            {PROFILE_COLORS.map((item) => (
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
                    <View style={styles.checkmarkRing}>
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.addIconsButton} activeOpacity={0.7}>
            <Text style={styles.addIconsText}>Add Icons To Replies</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <Text style={styles.footerText}>
            This color will be used for your name, the links you send, and replies to your messages.
          </Text>
        </View>
        <TouchableOpacity style={styles.applyButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>Apply Style</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  previewCard: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 16,
    overflow: 'hidden',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: typography.bold,
    color: '#ffffff',
  },
  profileName: {
    fontSize: 18,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 2,
  },
  profileStatus: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  messagesPreview: {
    marginTop: 16,
    gap: 10,
  },
  messageBox: {
    padding: 10,
    borderRadius: 10,
  },
  messageName: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    marginBottom: 3,
  },
  messageLinkTitle: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    color: colors.primary,
    marginBottom: 3,
  },
  messageText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 17,
  },
  messageTime: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 3,
    textAlign: 'right',
  },
  messageDescription: {
    paddingVertical: 6,
  },
  descriptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  colorItem: {
    width: (width - 92) / 7,
    alignItems: 'center',
  },
  colorCircle: {
    width: (width - 92) / 7,
    height: (width - 92) / 7,
    borderRadius: (width - 92) / 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  checkmarkRing: {
    width: '100%',
    height: '100%',
    borderRadius: (width - 92) / 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIconsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.separator,
    marginTop: 6,
  },
  addIconsText: {
    fontSize: 15,
    color: colors.text,
    fontFamily: typography.medium,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 10,
  },
  applyButton: {
    marginHorizontal: 12,
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: '#FFFFFF',
  },
});
