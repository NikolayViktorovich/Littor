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
            <Text style={styles.modalTitle}>Использование памяти</Text>
            <View style={styles.storageItem}>
              <View style={styles.storageLeft}>
                <Ionicons name="image" size={22} color={colors.text} />
                <Text style={styles.storageText}>Фото</Text>
              </View>
              <Text style={styles.storageValue}>120 МБ</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={styles.storageLeft}>
                <Ionicons name="videocam" size={22} color={colors.text} />
                <Text style={styles.storageText}>Видео</Text>
              </View>
              <Text style={styles.storageValue}>85 МБ</Text>
            </View>
            <View style={styles.storageItem}>
              <View style={styles.storageLeft}>
                <Ionicons name="document" size={22} color={colors.text} />
                <Text style={styles.storageText}>Файлы</Text>
              </View>
              <Text style={styles.storageValue}>40 МБ</Text>
            </View>
            <View style={styles.storageDivider} />
            <View style={styles.storageItem}>
              <Text style={styles.storageTotalText}>Всего</Text>
              <Text style={styles.storageTotalValue}>245 МБ</Text>
            </View>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        );
      case 'clearCache':
        return (
          <View style={styles.modalContent}>
            <Ionicons name="trash" size={48} color={colors.primary} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Очистить кэш</Text>
            <Text style={styles.modalDescription}>
              Это освободит место, удалив временные файлы
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleClearCache}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Очистить</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'networkUsage':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Использование сети</Text>
            <View style={styles.storageItem}>
              <Text style={styles.storageText}>Отправлено</Text>
              <Text style={styles.storageValue}>1.2 ГБ</Text>
            </View>
            <View style={styles.storageItem}>
              <Text style={styles.storageText}>Получено</Text>
              <Text style={styles.storageValue}>3.5 ГБ</Text>
            </View>
            <View style={styles.storageDivider} />
            <View style={styles.storageItem}>
              <Text style={styles.storageTotalText}>Всего</Text>
              <Text style={styles.storageTotalValue}>4.7 ГБ</Text>
            </View>
            <TouchableOpacity style={styles.modalButtonFull} onPress={closeModal}>
              <Text style={styles.modalButtonFullText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        );
      case 'proxy':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Настройки прокси</Text>
            <Text style={styles.modalDescription}>
              Настройте прокси-сервер для сетевых подключений
            </Text>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="close-circle" size={22} color={colors.text} />
              <Text style={styles.modalOptionText}>Отключено</Text>
              <Ionicons name="checkmark" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="globe" size={22} color={colors.text} />
              <Text style={styles.modalOptionText}>SOCKS5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              <Ionicons name="server" size={22} color={colors.text} />
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
        <Text style={styles.headerTitle}>Данные и память</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ХРАНИЛИЩЕ НА ЭТОМ УСТРОЙСТВЕ</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('storage')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="pie-chart" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Использование памяти</Text>
                <Text style={styles.settingSubtext}>245 МБ</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('clearCache')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
                <Ionicons name="trash" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Очистить кэш</Text>
                <Text style={styles.settingSubtext}>Освободить место</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>АВТОЗАГРУЗКА МЕДИА</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="image" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Фото</Text>
                <Text style={styles.settingSubtext}>По мобильной сети</Text>
              </View>
              <Switch
                value={autoDownloadPhotos}
                onValueChange={setAutoDownloadPhotos}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="videocam" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Видео</Text>
                <Text style={styles.settingSubtext}>По мобильной сети</Text>
              </View>
              <Switch
                value={autoDownloadVideos}
                onValueChange={setAutoDownloadVideos}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="document" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Файлы</Text>
                <Text style={styles.settingSubtext}>По мобильной сети</Text>
              </View>
              <Switch
                value={autoDownloadFiles}
                onValueChange={setAutoDownloadFiles}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>СЕТЬ И ДАННЫЕ</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="cellular" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Экономия трафика</Text>
                <Text style={styles.settingSubtext}>Снизить использование</Text>
              </View>
              <Switch
                value={useDataSaver}
                onValueChange={setUseDataSaver}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('networkUsage')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="stats-chart" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Использование сети</Text>
                <Text style={styles.settingSubtext}>Просмотр статистики</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => openModal('proxy')}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="wifi" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Настройки прокси</Text>
                <Text style={styles.settingSubtext}>Не настроено</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>КАЧЕСТВО ЗВОНКОВ</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="call" size={20} color="#ffffff" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingText}>Использовать меньше данных</Text>
                <Text style={styles.settingSubtext}>Низкое качество звука</Text>
              </View>
              <Switch
                value={useLessDataCalls}
                onValueChange={setUseLessDataCalls}
                trackColor={{ false: colors.separator, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Держите Littor быстрым, оставаясь в рамках вашего тарифного плана
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
    maxHeight: '80%',
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
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  storageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storageText: {
    fontSize: 16,
    color: colors.text,
  },
  storageValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  storageDivider: {
    height: 0.33,
    backgroundColor: colors.separator,
    marginVertical: 10,
  },
  storageTotalText: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  storageTotalValue: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.primary,
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
    marginTop: 16,
  },
  modalButtonFullText: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
});
