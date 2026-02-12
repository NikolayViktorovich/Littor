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
              <Ionicons name="musical-note" size={20} color={colors.text} />
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
          <Text style={styles.sectionTitle}>MESSAGES</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="chatbubble-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Private Chats</Text>
              </View>
              <Switch
                value={messageNotifications}
                onValueChange={setMessageNotifications}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="people-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Groups</Text>
              </View>
              <Switch
                value={groupNotifications}
                onValueChange={setGroupNotifications}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="megaphone-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Channels</Text>
              </View>
              <Switch
                value={channelNotifications}
                onValueChange={setChannelNotifications}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('sound')}>
              <View style={styles.settingLeft}>
                <Ionicons name="volume-high-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Sound</Text>
                  <Text style={styles.settingSubtext}>Default</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Vibration</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Badge Counter</Text>
              </View>
              <Switch
                value={badgeCounter}
                onValueChange={setBadgeCounter}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('preview')}>
              <View style={styles.settingLeft}>
                <Ionicons name="eye-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Message Preview</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{inAppPreview ? 'On' : 'Off'}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IN-APP</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="musical-notes-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>In-App Sounds</Text>
              </View>
              <Switch
                value={inAppSounds}
                onValueChange={setInAppSounds}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>In-App Vibration</Text>
              </View>
              <Switch
                value={inAppVibration}
                onValueChange={setInAppVibration}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Customize notifications for individual chats in their profile pages
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
    marginHorizontal: 12,
    borderRadius: 10,
    padding: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 10,
    width: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingText: {
    fontSize: 14,
    color: colors.text,
  },
  settingSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 4,
    marginLeft: 28,
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
    borderRadius: 10,
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
