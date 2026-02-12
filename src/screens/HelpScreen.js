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
            <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
            <ScrollView style={styles.faqScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How do I delete a message?</Text>
                <Text style={styles.faqAnswer}>Long press on the message and select Delete</Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Can I edit sent messages?</Text>
                <Text style={styles.faqAnswer}>Yes, long press and select Edit within 48 hours</Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>How do I create a group?</Text>
                <Text style={styles.faqAnswer}>Go to Contacts, tap New Group, and add members</Text>
              </View>
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Is my data encrypted?</Text>
                <Text style={styles.faqAnswer}>Yes, all messages use end-to-end encryption</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case 'contact':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact Support</Text>
            <Text style={styles.modalDescription}>
              How would you like to contact us?
            </Text>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleContactSupport('email')}
            >
              <Ionicons name="mail-outline" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Email Support</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleContactSupport('chat')}
            >
              <Ionicons name="chatbubbles-outline" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Live Chat</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        );
      case 'bug':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report a Bug</Text>
            <Text style={styles.modalDescription}>
              Describe the issue you're experiencing
            </Text>
            <TextInput
              style={styles.modalTextArea}
              placeholder="Describe the bug..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={bugDescription}
              onChangeText={setBugDescription}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleSubmitBug}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'whatsNew':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>What's New</Text>
            <ScrollView style={styles.faqScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.changelogItem}>
                <Text style={styles.changelogVersion}>Version 1.0.0</Text>
                <Text style={styles.changelogDate}>February 2026</Text>
                <Text style={styles.changelogText}>• New compact UI design</Text>
                <Text style={styles.changelogText}>• Custom profile colors</Text>
                <Text style={styles.changelogText}>• Chat wallpapers</Text>
                <Text style={styles.changelogText}>• Improved performance</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case 'tips':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tips & Tricks</Text>
            <ScrollView style={styles.faqScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={20} color={colors.primary} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Quick Reply</Text>
                  <Text style={styles.tipText}>Swipe right on a message to reply quickly</Text>
                </View>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={20} color={colors.primary} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Search Messages</Text>
                  <Text style={styles.tipText}>Use the search icon in chat to find messages</Text>
                </View>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="bulb" size={20} color={colors.primary} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Customize Colors</Text>
                  <Text style={styles.tipText}>Change profile and chat colors in settings</Text>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Close</Text>
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
        <Text style={styles.headerTitle}>Help</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('faq')}>
              <View style={styles.settingLeft}>
                <Ionicons name="help-circle-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>FAQ</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('contact')}>
              <View style={styles.settingLeft}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('bug')}>
              <View style={styles.settingLeft}>
                <Ionicons name="bug-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Report a Bug</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.settingRow} 
              onPress={() => Linking.openURL('https://example.com/privacy')}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="shield-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.settingRow} 
              onPress={() => Linking.openURL('https://example.com/terms')}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="document-text-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Terms of Service</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>App Version</Text>
                  <Text style={styles.settingSubtext}>1.0.0</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FEATURES</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('whatsNew')}>
              <View style={styles.settingLeft}>
                <Ionicons name="sparkles-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>What's New</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('tips')}>
              <View style={styles.settingLeft}>
                <Ionicons name="bulb-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <Text style={styles.settingText}>Tips & Tricks</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={40} color={colors.primary} />
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            Our support team is available 24/7 to help you
          </Text>
          <TouchableOpacity style={styles.infoButton} onPress={() => openModal('contact')}>
            <Text style={styles.infoButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Littor Messenger</Text>
          <Text style={styles.footerSubtext}>Made with ❤️</Text>
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
  divider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 4,
    marginLeft: 28,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 12,
    marginTop: 20,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 17,
    fontFamily: typography.bold,
    color: colors.text,
    marginTop: 10,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  infoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
  },
  infoButtonText: {
    fontSize: 14,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.textTertiary,
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
    maxHeight: '80%',
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
    lineHeight: 18,
  },
  modalTextArea: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  faqScroll: {
    maxHeight: 300,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  changelogItem: {
    marginBottom: 16,
  },
  changelogVersion: {
    fontSize: 15,
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 2,
  },
  changelogDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  changelogText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 2,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
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
  modalButtonFull: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalButtonFullText: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
});
