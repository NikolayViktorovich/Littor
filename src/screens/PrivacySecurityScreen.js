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

export default function PrivacySecurityScreen({ navigation }) {
  const [twoStepVerification, setTwoStepVerification] = useState(false);
  const [passcode, setPasscode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [phoneNumberPrivacy, setPhoneNumberPrivacy] = useState('everyone');
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState('everyone');
  const [profilePhotoPrivacy, setProfilePhotoPrivacy] = useState('everyone');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
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
    setPasswordInput('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSetupTwoStep = () => {
    setTwoStepVerification(true);
    closeModal();
  };

  const handleSetupPasscode = () => {
    setPasscode(true);
    closeModal();
  };

  const handlePrivacyChange = (setting, value) => {
    switch (setting) {
      case 'phone':
        setPhoneNumberPrivacy(value);
        break;
      case 'lastSeen':
        setLastSeenPrivacy(value);
        break;
      case 'photo':
        setProfilePhotoPrivacy(value);
        break;
    }
    closeModal();
  };

  const handleDeleteAccount = () => {
    closeModal();
    setTimeout(() => {
      openModal('deleteConfirm');
    }, 300);
  };

  const getPrivacyLabel = (value) => {
    switch (value) {
      case 'everyone': return 'Everyone';
      case 'contacts': return 'My Contacts';
      case 'nobody': return 'Nobody';
      default: return value;
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'twoStep':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Two-Step Verification</Text>
            <Text style={styles.modalDescription}>
              Set up an additional password required when logging in on a new device
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleSetupTwoStep}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Set Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'passcode':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Passcode Lock</Text>
            <Text style={styles.modalDescription}>
              Set up a passcode to lock your app
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter 4-digit passcode"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleSetupPasscode}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Set Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'phonePrivacy':
      case 'lastSeenPrivacy':
      case 'photoPrivacy':
        const settingMap = {
          phonePrivacy: 'phone',
          lastSeenPrivacy: 'lastSeen',
          photoPrivacy: 'photo',
        };
        const setting = settingMap[modalType];
        const currentValue = {
          phone: phoneNumberPrivacy,
          lastSeen: lastSeenPrivacy,
          photo: profilePhotoPrivacy,
        }[setting];
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Who can see this?</Text>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handlePrivacyChange(setting, 'everyone')}
            >
              <Ionicons name="globe" size={22} color={colors.text} />
              <Text style={styles.modalOptionText}>Everyone</Text>
              {currentValue === 'everyone' && (
                <Ionicons name="checkmark" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handlePrivacyChange(setting, 'contacts')}
            >
              <Ionicons name="people" size={22} color={colors.text} />
              <Text style={styles.modalOptionText}>My Contacts</Text>
              {currentValue === 'contacts' && (
                <Ionicons name="checkmark" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handlePrivacyChange(setting, 'nobody')}
            >
              <Ionicons name="eye-off" size={22} color={colors.text} />
              <Text style={styles.modalOptionText}>Nobody</Text>
              {currentValue === 'nobody' && (
                <Ionicons name="checkmark" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        );
      case 'deleteAccount':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalDescription}>
              This will permanently delete your account and all data
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonDanger]} 
                onPress={handleDeleteAccount}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'deleteConfirm':
        return (
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color={colors.error} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Are you absolutely sure?</Text>
            <Text style={styles.modalDescription}>
              This action cannot be undone. All your messages, media, and contacts will be permanently deleted.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonDanger]} 
                onPress={closeModal}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextDanger]}>Confirm Delete</Text>
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
        <Text style={styles.headerTitle}>Приватность и безопасность</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ВАША БЕЗОПАСНОСТЬ</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('twoStep')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Двухфакторная аутентификация</Text>
                <Text style={styles.settingSubtext}>
                  {twoStepVerification ? 'Включена' : 'Не настроена'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('passcode')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF9500' }]}>
                <Ionicons name="lock-closed" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Код-пароль</Text>
                <Text style={styles.settingSubtext}>
                  {passcode ? 'Включён' : 'Не настроен'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="finger-print" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Биометрическая блокировка</Text>
              </View>
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>КТО МОЖЕТ ВАС ВИДЕТЬ</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('phonePrivacy')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="call" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Номер телефона</Text>
                <Text style={styles.settingSubtext}>
                  {getPrivacyLabel(phoneNumberPrivacy)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('lastSeenPrivacy')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="time" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Был(а) в сети</Text>
                <Text style={styles.settingSubtext}>
                  {getPrivacyLabel(lastSeenPrivacy)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('photoPrivacy')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="image" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Фото профиля</Text>
                <Text style={styles.settingSubtext}>
                  {getPrivacyLabel(profilePhotoPrivacy)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="chatbubbles" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Группы и каналы</Text>
                <Text style={styles.settingSubtext}>Все</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>РАСШИРЕННЫЕ НАСТРОЙКИ</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="ban" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Заблокированные пользователи</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>0</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#AF52DE' }]}>
                <Ionicons name="key" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Активные сеансы</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('deleteAccount')}>
              <Ionicons name="trash" size={22} color={colors.error} style={styles.settingIcon} />
              <View style={styles.settingContent}>
                <Text style={[styles.settingText, styles.dangerText]}>Удалить мой аккаунт</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Вы всегда контролируете, чем делитесь и кто может с вами связаться
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
  dangerText: {
    color: colors.error,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
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
  },
  modalContent: {
    padding: 24,
    paddingBottom: 32,
  },
  modalIcon: {
    alignSelf: 'center',
    marginBottom: 16,
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
  modalInput: {
    backgroundColor: colors.inputBg,
    borderRadius: 20,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
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
  modalButtonDanger: {
    backgroundColor: colors.error,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  modalButtonTextPrimary: {
    color: '#ffffff',
  },
  modalButtonTextDanger: {
    color: '#ffffff',
  },
});
