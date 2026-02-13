import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

const MOCK_DEVICES = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    location: 'Москва, Россия',
    lastActive: 'Сейчас активно',
    isCurrentDevice: true,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    location: 'Москва, Россия',
    lastActive: '2 часа назад',
    isCurrentDevice: false,
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    location: 'Санкт-Петербург, Россия',
    lastActive: '1 день назад',
    isCurrentDevice: false,
  },
];

export default function DevicesScreen({ navigation }) {
  const [devices, setDevices] = useState(MOCK_DEVICES);
  const currentDevice = devices.find(d => d.isCurrentDevice);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return 'phone-portrait';
      case 'desktop':
        return 'laptop';
      case 'tablet':
        return 'tablet-portrait';
      default:
        return 'phone-portrait';
    }
  };

  const getDeviceColor = (type) => {
    switch (type) {
      case 'mobile':
        return '#0A84FF';
      case 'desktop':
        return '#5856D6';
      case 'tablet':
        return '#FF9500';
      default:
        return '#0A84FF';
    }
  };

  const handleTerminateSession = (deviceId) => {
    Alert.alert(
      'Завершить сеанс',
      'Вы уверены, что хотите завершить этот сеанс?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Завершить',
          style: 'destructive',
          onPress: () => {
            setDevices(prev => prev.filter(d => d.id !== deviceId));
            Alert.alert('Готово', 'Сеанс завершён');
          },
        },
      ]
    );
  };

  const handleTerminateAll = () => {
    Alert.alert(
      'Завершить все сеансы',
      'Вы выйдете из всех устройств, кроме этого.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Завершить все',
          style: 'destructive',
          onPress: () => {
            setDevices(prev => prev.filter(d => d.isCurrentDevice));
            Alert.alert('Готово', 'Все остальные сеансы завершены');
          },
        },
      ]
    );
  };

  const renderDevice = ({ item }) => (
    <View style={styles.deviceItem}>
      <View style={[styles.deviceIconContainer, { backgroundColor: getDeviceColor(item.type) }]}>
        <Ionicons 
          name={getDeviceIcon(item.type)} 
          size={20} 
          color="#ffffff" 
        />
      </View>
      <View style={styles.deviceContent}>
        <View style={styles.deviceHeader}>
          <Text style={styles.deviceName}>{item.name}</Text>
          {item.isCurrentDevice && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Текущее</Text>
            </View>
          )}
        </View>
        <Text style={styles.deviceLocation}>{item.location}</Text>
        <Text style={styles.deviceLastActive}>{item.lastActive}</Text>
      </View>
      {!item.isCurrentDevice && (
        <TouchableOpacity
          style={styles.terminateButton}
          onPress={() => handleTerminateSession(item.id)}
        >
          <Ionicons name="close-circle" size={24} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );

  const otherDevices = devices.filter(d => !d.isCurrentDevice);

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
        <Text style={styles.headerTitle}>Ваши устройства</Text>
        <View style={styles.headerRight} />
      </View>
      <FlatList
        data={otherDevices}
        renderItem={renderDevice}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {currentDevice && (
              <View style={styles.currentCard}>
                <View style={styles.currentTop}>
                  <View style={[styles.deviceIconContainer, { backgroundColor: getDeviceColor(currentDevice.type) }]}>
                    <Ionicons
                      name={getDeviceIcon(currentDevice.type)}
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                  <View style={styles.currentContent}>
                    <Text style={styles.currentTitle}>{currentDevice.name}</Text>
                    <Text style={styles.currentSubtitle}>{currentDevice.location}</Text>
                  </View>
                  <View style={styles.currentChip}>
                    <Text style={styles.currentChipText}>Это устройство</Text>
                  </View>
                </View>
                <Text style={styles.currentStatus}>{currentDevice.lastActive}</Text>
              </View>
            )}
            <View style={styles.infoCard}>
              <View style={[styles.iconContainer, { backgroundColor: '#0A84FF' }]}>
                <Ionicons name="information-circle" size={18} color="#ffffff" />
              </View>
              <Text style={styles.infoText}>
                Вы вошли на этих устройствах. Удалите всё незнакомое.
              </Text>
            </View>
            {otherDevices.length > 0 && (
              <Text style={styles.sectionTitle}>ДРУГИЕ СЕАНСЫ</Text>
            )}
          </View>
        }
        ListFooterComponent={
          otherDevices.length > 0 && (
            <TouchableOpacity 
              style={styles.terminateAllButton}
              onPress={handleTerminateAll}
            >
              <Ionicons name="log-out" size={20} color={colors.error} />
              <Text style={styles.terminateAllText}>Выйти с других устройств</Text>
            </TouchableOpacity>
          )
        }
      />
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 20,
    gap: 10,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  currentCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  currentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentContent: {
    flex: 1,
  },
  currentTitle: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  currentSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  currentChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    marginLeft: 8,
  },
  currentChipText: {
    fontSize: 11,
    fontFamily: typography.semiBold,
    color: colors.success,
  },
  currentStatus: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 20,
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceContent: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 15,
    fontFamily: typography.medium,
    color: colors.text,
  },
  currentBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 36,
  },
  currentBadgeText: {
    fontSize: 10,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  deviceLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  deviceLastActive: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  terminateButton: {
    padding: 6,
  },
  terminateAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 20,
    gap: 8,
  },
  terminateAllText: {
    fontSize: 15,
    fontFamily: typography.medium,
    color: colors.error,
  },
});
