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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
export default function DataStorageScreen({ navigation }) {
  const [autoDownloadPhotos, setAutoDownloadPhotos] = useState(true);
  const [autoDownloadVideos, setAutoDownloadVideos] = useState(false);
  const [autoDownloadFiles, setAutoDownloadFiles] = useState(false);
  const [useDataSaver, setUseDataSaver] = useState(false);
  const [useLessDataCalls, setUseLessDataCalls] = useState(false);
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
  const handleClearCache = () => {
    closeModal();
  };
  const renderModalContent = () => {
    switch (modalType) {
      case 'storage':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Storage Usage</Text>
            <View style={styles.storageItem}>
              <View style={styles.storageLeft}>
                <Ionicons name="image" size={20} color={colors.text} />
                <Text style={styles.storageText}>Photos</Text>
              </View>
              <Text style={styles.storageValue}>120 MB</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={styles.storageLeft}>
                <Ionicons name="videocam" size={20} color={colors.text} />
                <Text style={styles.storageText}>Videos</Text>
              </View>
              <Text style={styles.storageValue}>85 MB</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={styles.storageLeft}>
                <Ionicons name="document" size={20} color={colors.text} />
                <Text style={styles.storageText}>Files</Text>
              </View>
              <Text style={styles.storageValue}>40 MB</Text>
            </View>
            <View style={styles.storageDivider} />
            <View style={styles.storageItem}>
              <Text style={styles.storageTotalText}>Total</Text>
              <Text style={styles.storageTotalValue}>245 MB</Text>
            </View>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case 'clearCache':
        return (
          <View style={styles.modalContent}>
            <Ionicons name="trash" size={48} color={colors.primary} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Clear Cache</Text>
            <Text style={styles.modalDescription}>
              This will free up storage space by removing temporary files
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleClearCache}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'networkUsage':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Network Usage</Text>
            <View style={styles.storageItem}>
              <Text style={styles.storageText}>Sent</Text>
              <Text style={styles.storageValue}>1.2 GB</Text>
            </View>
            <View style={styles.storageItem}>
              <Text style={styles.storageText}>Received</Text>
              <Text style={styles.storageValue}>3.5 GB</Text>
            </View>
            <View style={styles.storageDivider} />
            <View style={styles.storageItem}>
              <Text style={styles.storageTotalText}>Total</Text>
              <Text style={styles.storageTotalValue}>4.7 GB</Text>
            </View>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case 'proxy':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Proxy Settings</Text>
            <Text style={styles.modalDescription}>
              Configure proxy server for network connections
            </Text>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="close-circle-outline" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Disabled</Text>
              <Ionicons name="checkmark" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="globe-outline" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>SOCKS5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="server-outline" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>HTTP</Text>
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
        <Text style={styles.headerTitle}>Data & Storage</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STORAGE</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('storage')}>
              <View style={styles.settingLeft}>
                <Ionicons name="pie-chart-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Storage Usage</Text>
                  <Text style={styles.settingSubtext}>245 MB</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('clearCache')}>
              <View style={styles.settingLeft}>
                <Ionicons name="trash-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Clear Cache</Text>
                  <Text style={styles.settingSubtext}>Free up space</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUTO-DOWNLOAD</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="image-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Photos</Text>
                  <Text style={styles.settingSubtext}>On mobile data</Text>
                </View>
              </View>
              <Switch
                value={autoDownloadPhotos}
                onValueChange={setAutoDownloadPhotos}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="videocam-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Videos</Text>
                  <Text style={styles.settingSubtext}>On mobile data</Text>
                </View>
              </View>
              <Switch
                value={autoDownloadVideos}
                onValueChange={setAutoDownloadVideos}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="document-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Files</Text>
                  <Text style={styles.settingSubtext}>On mobile data</Text>
                </View>
              </View>
              <Switch
                value={autoDownloadFiles}
                onValueChange={setAutoDownloadFiles}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA USAGE</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="cellular-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Data Saver</Text>
                  <Text style={styles.settingSubtext}>Reduce usage</Text>
                </View>
              </View>
              <Switch
                value={useDataSaver}
                onValueChange={setUseDataSaver}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('networkUsage')}>
              <View style={styles.settingLeft}>
                <Ionicons name="stats-chart-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Network Usage</Text>
                  <Text style={styles.settingSubtext}>View statistics</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('proxy')}>
              <View style={styles.settingLeft}>
                <Ionicons name="wifi-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Proxy Settings</Text>
                  <Text style={styles.settingSubtext}>Not configured</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CALLS</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="call-outline" size={18} color={colors.text} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={styles.settingText}>Use Less Data</Text>
                  <Text style={styles.settingSubtext}>Lower audio quality</Text>
                </View>
              </View>
              <Switch
                value={useLessDataCalls}
                onValueChange={setUseLessDataCalls}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
                style={styles.switch}
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Manage data usage and storage to optimize performance
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
  modalIcon: {
    alignSelf: 'center',
    marginBottom: 12,
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
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  storageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storageText: {
    fontSize: 14,
    color: colors.text,
  },
  storageValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  storageDivider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 8,
  },
  storageTotalText: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  storageTotalValue: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.primary,
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
    marginTop: 12,
  },
  modalButtonFullText: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
});
