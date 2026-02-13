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
  { id: '1', color: '#007AFF', name: 'Синий', category: 'Классика' },
  { id: '2', color: '#34C759', name: 'Зелёный', category: 'Классика' },
  { id: '3', color: '#FF9500', name: 'Оранжевый', category: 'Классика' },
  { id: '4', color: '#FF3B30', name: 'Красный', category: 'Классика' },
  { id: '5', color: '#5856D6', name: 'Фиолетовый', category: 'Классика' },
  { id: '6', color: '#00C7BE', name: 'Бирюзовый', category: 'Классика' },
  { id: '7', color: '#FF2D55', name: 'Розовый', category: 'Яркие' },
  { id: '8', color: '#32ADE6', name: 'Небесный', category: 'Яркие' },
  { id: '9', color: '#8BC34A', name: 'Лайм', category: 'Яркие' },
  { id: '10', color: '#FFB84D', name: 'Янтарный', category: 'Яркие' },
  { id: '11', color: '#FF6B6B', name: 'Коралловый', category: 'Яркие' },
  { id: '12', color: '#AF52DE', name: 'Фиалковый', category: 'Яркие' },
  { id: '13', color: '#A8E6CF', name: 'Мятный', category: 'Пастель' },
  { id: '14', color: '#FFB3BA', name: 'Розовый', category: 'Пастель' },
  { id: '15', color: '#BAE1FF', name: 'Голубой', category: 'Пастель' },
  { id: '16', color: '#FFFFBA', name: 'Лимонный', category: 'Пастель' },
  { id: '17', color: '#FFD9BA', name: 'Персиковый', category: 'Пастель' },
  { id: '18', color: '#E0BBE4', name: 'Лавандовый', category: 'Пастель' },
  { id: '19', color: '#1A535C', name: 'Океан', category: 'Тёмные' },
  { id: '20', color: '#6A4C93', name: 'Сливовый', category: 'Тёмные' },
  { id: '21', color: '#C44569', name: 'Винный', category: 'Тёмные' },
  { id: '22', color: '#2C5F2D', name: 'Лесной', category: 'Тёмные' },
  { id: '23', color: '#8B4513', name: 'Коричневый', category: 'Тёмные' },
  { id: '24', color: '#2F4858', name: 'Морской', category: 'Тёмные' },
];

const getColumnsCount = (screenWidth) => {
  if (screenWidth >= 768) return 6;
  if (screenWidth >= 600) return 5;
  return 4;
};

export default function ProfileColorScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const [selectedColor, setSelectedColor] = useState(profile.profileColor || '#FF3B30');
  const [selectedCategory, setSelectedCategory] = useState('Classic');
  const [screenWidth, setScreenWidth] = useState(width);

  const categories = ['Классика', 'Яркие', 'Пастель', 'Тёмные'];
  const filteredColors = PROFILE_COLORS.filter(c => c.category === selectedCategory);
  const columnsCount = getColumnsCount(screenWidth);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    updateProfile({ profileColor: color });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Цвет профиля</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.previewCard}>
          <View style={styles.messagesPreview}>
            <View style={styles.messageRow}>
              <View style={[styles.messageBubble, styles.messageBubbleOther]}>
                <Text style={styles.messageText}>Привет! Как дела?</Text>
                <Text style={styles.messageTime}>12:30</Text>
              </View>
            </View>
            <View style={[styles.messageRow, styles.messageRowOwn]}>
              <View style={[styles.messageBubble, styles.messageBubbleOwn, { backgroundColor: selectedColor }]}>
                <Text style={styles.messageTextOwn}>Отлично, спасибо!</Text>
                <Text style={styles.messageTimeOwn}>12:31</Text>
              </View>
            </View>
            <View style={styles.messageRow}>
              <View style={[styles.messageBubble, styles.messageBubbleOther]}>
                <Text style={styles.messageText}>Классный цвет 👍</Text>
                <Text style={styles.messageTime}>12:32</Text>
              </View>
            </View>
          </View>

          <View style={styles.hintBox}>
            <Ionicons name="information-circle" size={18} color={colors.textSecondary} />
            <Text style={styles.hintText}>
              Ваши сообщения будут отображаться этим цветом
            </Text>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.colorsSection}>
          <View style={styles.colorsGrid}>
            {filteredColors.map((item, index) => {
              const itemWidth = (screenWidth - 32 - (columnsCount - 1) * 12) / columnsCount;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.colorItem, { width: itemWidth }]}
                  onPress={() => handleColorSelect(item.color)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.colorCircle, 
                    { backgroundColor: item.color },
                    selectedColor === item.color && styles.colorCircleSelected
                  ]}>
                    {selectedColor === item.color && (
                      <View style={styles.checkmarkContainer}>
                        <Ionicons name="checkmark" size={24} color="#ffffff" />
                      </View>
                    )}
                  </View>
                  <Text 
                    style={[
                      styles.colorName,
                      selectedColor === item.color && styles.colorNameSelected
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  previewCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 30,
    padding: 16,
    overflow: 'hidden',
  },
  messagesPreview: {
    gap: 8,
    marginBottom: 12,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowOwn: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 27,
    padding: 10,
    paddingHorizontal: 12,
  },
  messageBubbleOther: {
    backgroundColor: colors.surfaceLight,
    borderBottomLeftRadius: 6,
  },
  messageBubbleOwn: {
    borderBottomRightRadius: 6,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
    lineHeight: 18,
  },
  messageTextOwn: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 2,
    lineHeight: 18,
  },
  messageTime: {
    fontSize: 11,
    color: colors.textTertiary,
    alignSelf: 'flex-end',
  },
  messageTimeOwn: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 20,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  categoriesSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text,
  },
  categoryTextActive: {
    color: '#ffffff',
    fontFamily: typography.semiBold,
  },
  colorsSection: {
    marginHorizontal: 16,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorItem: {
    alignItems: 'center',
    marginBottom: 8,
  },
  colorCircle: {
    width: 56,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: colors.text,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  checkmarkContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorName: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  colorNameSelected: {
    fontSize: 11,
    color: colors.text,
    fontFamily: typography.semiBold,
    textAlign: 'center',
  },
});
