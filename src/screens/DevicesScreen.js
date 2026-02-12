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
    location: 'Moscow, Russia',
    lastActive: 'Active now',
    isCurrentDevice: true,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    location: 'Moscow, Russia',
    lastActive: '2 hours ago',
    isCurrentDevice: false,
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    location: 'Saint Petersburg, Russia',
    lastActive: '1 day ago',
    isCurrentDevice: false,
  },
];
export default function DevicesScreen({ navigation }) {
  const [devices, setDevices] = useState(MOCK_DEVICES);
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
  const handleTerminateSession = (deviceId) => {
    Alert.alert(
      'Terminate Session',
      'Are you sure you want to terminate this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: () => {
            setDevices(prev => prev.filter(d => d.id !== deviceId));
            Alert.alert('Success', 'Session terminated');
          },
        },
      ]
    );
  };
  const handleTerminateAll = () => {
    Alert.alert(
      'Terminate All Sessions',
      'This will log you out from all devices except this one.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate All',
          style: 'destructive',
          onPress: () => {
            setDevices(prev => prev.filter(d => d.isCurrentDevice));
            Alert.alert('Success', 'All other sessions terminated');
          },
        },
      ]
    );
  };
  const renderDevice = ({ item }) => (
    <View style={styles.deviceItem}>
      <View style={[styles.deviceIcon, item.isCurrentDevice && styles.deviceIconActive]}>
        <Ionicons 
          name={getDeviceIcon(item.type)} 
          size={20} 
          color={colors.text} 
        />
      </View>
      <View style={styles.deviceContent}>
        <View style={styles.deviceHeader}>
          <Text style={styles.deviceName}>{item.name}</Text>
          {item.isCurrentDevice && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current</Text>
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
          <Ionicons name="close-circle" size={20} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
  const otherDevices = devices.filter(d => !d.isCurrentDevice);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Devices</Text>
          <View style={styles.headerRight} />
        </View>
      </View>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
            <Text style={styles.infoText}>
              You can log in to Littor from multiple devices. Active sessions are shown below.
            </Text>
          </View>
        }
        ListFooterComponent={
          otherDevices.length > 0 && (
            <TouchableOpacity 
              style={styles.terminateAllButton}
              onPress={handleTerminateAll}
            >
              <Ionicons name="log-out-outline" size={18} color={colors.error} />
              <Text style={styles.terminateAllText}>Terminate All Other Sessions</Text>
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
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 12,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deviceIconActive: {
    backgroundColor: colors.surfaceLight,
  },
  deviceContent: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
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
    borderRadius: 6,
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
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  terminateAllText: {
    fontSize: 15,
    fontFamily: typography.medium,
    color: colors.error,
  },
});
