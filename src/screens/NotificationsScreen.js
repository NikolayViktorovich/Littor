import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
  Modal,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
export default function NotificationsScreen({ navigation }) {
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [channelNotifications, setChannelNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [inAppSounds, setInAppSounds] = useState(true);
  const [inAppVibration, setInAppVibration] = useState(false);
  const [inAppPreview, setInAppPreview] = useState(true);
  const [badgeCounter, setBadgeCounter] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
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
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const renderModalContent = () => {
    switch (modalType) {
      case 'sound':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notification Sound</Text>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="musical-notes" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Default</Text>
              <Ionicons name="checkmark" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="musical-notes" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Classic</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="volume-high" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Modern</Text>
            </TouchableOpacity>
          </View>
        );
      case 'preview':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Message Preview</Text>
            <Text style={styles.modalDescription}>
              Show message text in notifications
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={closeModal}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Enable</Text>
              </TouchableOpacity>
            </View>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Оповещения о сообщениях</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="chatbubble" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Личные чаты</Text>
              </View>
              <Switch
                value={messageNotifications}
                onValueChange={setMessageNotifications}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#32ADE6' }]}>
                <Ionicons name="people" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Группы</Text>
              </View>
              <Switch
                value={groupNotifications}
                onValueChange={setGroupNotifications}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#5856D6' }]}>
                <Ionicons name="megaphone" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Каналы</Text>
              </View>
              <Switch
                value={channelNotifications}
                onValueChange={setChannelNotifications}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Как они выглядят</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('sound')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="volume-high" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Звук</Text>
                <Text style={styles.settingSubtext}>По умолчанию</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF2D55' }]}>
                <Ionicons name="phone-portrait" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Вибрация</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
                <Ionicons name="notifications" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Счётчик уведомлений</Text>
              </View>
              <Switch
                value={badgeCounter}
                onValueChange={setBadgeCounter}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('preview')}>
              <View style={[styles.iconContainer, { backgroundColor: '#34C759' }]}>
                <Ionicons name="eye" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Предпросмотр сообщений</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{inAppPreview ? 'Вкл.' : 'Выкл.'}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Внутри приложения</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#AF52DE' }]}>
                <Ionicons name="musical-notes" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Звуки в приложении</Text>
              </View>
              <Switch
                value={inAppSounds}
                onValueChange={setInAppSounds}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF2D55' }]}>
                <Ionicons name="phone-portrait" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Вибрация в приложении</Text>
              </View>
              <Switch
                value={inAppVibration}
                onValueChange={setInAppVibration}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Вы можете настроить оповещения для конкретного чата в его профиле
          </Text>
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
    paddingHorizontal: 12,
    marginBottom: 6,
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
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  divider: {
    height: 0.33,
    backgroundColor: colors.separator,
    marginLeft: 52,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24.0,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  modalButtonTextPrimary: {
    color: '#ffffff',
  },
});
