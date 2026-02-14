import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Linking,
  Modal,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

export default function HelpScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const openModal = (type) => {
    setModalType(type);
    setBugDescription('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleContactSupport = (method) => {
    closeModal();
    if (method === 'email') {
      Linking.openURL('mailto:support@littor.app');
    }
  };

  const handleSubmitBug = () => {
    closeModal();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'faq':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Часто задаваемые вопросы</Text>
            <ScrollView style={styles.faqScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Как удалить сообщение?</Text>
                <Text style={styles.faqAnswer}>Долгое нажатие на сообщение и выберите Удалить</Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Можно ли редактировать отправленные сообщения?</Text>
                <Text style={styles.faqAnswer}>Да, долгое нажатие и выберите Редактировать в течение 48 часов</Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Как создать группу?</Text>
                <Text style={styles.faqAnswer}>Перейдите в Контакты, нажмите Новая группа и добавьте участников</Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Зашифрованы ли мои данные?</Text>
                <Text style={styles.faqAnswer}>Да, все сообщения используют сквозное шифрование</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        );
      case 'contact':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Связаться с поддержкой</Text>
            <Text style={styles.modalDescription}>
              Как вы хотите связаться с нами?
            </Text>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleContactSupport('email')}
            >
              <Ionicons name="mail" size={22} color={colors.text} />
              <Text style={styles.modalOptionText}>Поддержка по email</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleContactSupport('chat')}
            >
              <Ionicons name="chatbubbles" size={22} color={colors.text} />
              <Text style={styles.modalOptionText}>Онлайн-чат</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        );
      case 'bug':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Сообщить об ошибке</Text>
            <Text style={styles.modalDescription}>
              Опишите проблему, с которой вы столкнулись
            </Text>
            <TextInput
              style={styles.modalTextArea}
              placeholder="Опишите ошибку..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={bugDescription}
              onChangeText={setBugDescription}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleSubmitBug}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Отправить</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'whatsNew':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Что нового</Text>
            <ScrollView style={styles.faqScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.changelogItem}>
                <Text style={styles.changelogVersion}>Версия 1.0.0</Text>
                <Text style={styles.changelogDate}>Февраль 2026</Text>
                <Text style={styles.changelogText}>• Новый компактный дизайн интерфейса</Text>
                <Text style={styles.changelogText}>• Пользовательские цвета профиля</Text>
                <Text style={styles.changelogText}>• Фоны для чатов</Text>
                <Text style={styles.changelogText}>• Улучшенная производительность</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        );
      case 'tips':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Советы и хитрости</Text>
            <ScrollView style={styles.faqScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={22} color={colors.primary} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Быстрый ответ</Text>
                  <Text style={styles.tipText}>Свайп вправо по сообщению для быстрого ответа</Text>
                </View>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={22} color={colors.primary} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Поиск сообщений</Text>
                  <Text style={styles.tipText}>Используйте иконку поиска в чате для поиска сообщений</Text>
                </View>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={22} color={colors.primary} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Настройка цветов</Text>
                  <Text style={styles.tipText}>Измените цвета профиля и чата в настройках</Text>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
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
        <Text style={styles.headerTitle}>Помощь</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ПОДДЕРЖКА</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('faq')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="help-circle" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Часто задаваемые вопросы</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('contact')}>
              <View style={[styles.iconContainer, { backgroundColor: '#32ADE6' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Связаться с поддержкой</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('bug')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
                <Ionicons name="bug" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Сообщить об ошибке</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О LITTOR</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingRow} 
              onPress={() => Linking.openURL('https://example.com/privacy')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#34C759' }]}>
                <Ionicons name="shield" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Политика конфиденциальности</Text>
              </View>
              <Ionicons name="open" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.settingRow} 
              onPress={() => Linking.openURL('https://example.com/terms')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#5856D6' }]}>
                <Ionicons name="document-text" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Условия использования</Text>
              </View>
              <Ionicons name="open" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="information-circle" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Версия приложения</Text>
                <Text style={styles.settingSubtext}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>СОВЕТЫ И ФУНКЦИИ</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('whatsNew')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="sparkles" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Что нового</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('tips')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="bulb" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Советы и хитрости</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Littor Messenger</Text>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
        </TouchableOpacity>
        <Animated.View 
          style={[
            styles.menuContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {renderModalContent()}
        </Animated.View>
      </Modal>
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
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingIcon: {
    marginRight: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingText: {
    fontSize: 15,
    color: colors.text,
  },
  settingSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 0.33,
    backgroundColor: colors.separator,
    marginLeft: 52,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    maxHeight: '80%',
  },
  modalContent: {
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalTextArea: {
    backgroundColor: colors.inputBg,
    borderRadius: 20,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  faqScroll: {
    maxHeight: 300,
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 18,
  },
  faqQuestion: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  changelogItem: {
    marginBottom: 18,
  },
  changelogVersion: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 4,
  },
  changelogDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  changelogText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 2,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 14,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  modalButtonTextPrimary: {
    color: '#ffffff',
  },
  modalButtonFull: {
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalButtonFullText: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
});
