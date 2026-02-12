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
import { colors } from '../theme/colors';

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
          size={24} 
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
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
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
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 44,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    gap: 8,
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  currentBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  deviceLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  deviceLastActive: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  terminateButton: {
    padding: 8,
  },
  terminateAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  terminateAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
  },
});
