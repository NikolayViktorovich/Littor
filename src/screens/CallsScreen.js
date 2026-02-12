import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'missed', label: 'Missed' },
];
export default function CallsScreen({ navigation }) {
  const { calls, contacts, addCall } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const filteredCalls = useMemo(() => {
    if (selectedFilter === 'all') return calls;
    return calls.filter(call => call.type === 'missed');
  }, [calls, selectedFilter]);
  const handleStartCall = () => {
    if (contacts.length === 0) {
      Alert.alert('No Contacts', 'Add contacts first to make a call');
      return;
    }
    Alert.alert(
      'Start Call',
      'Select a contact',
      contacts.slice(0, 5).map(contact => ({
        text: contact.name,
        onPress: () => {
          addCall(contact, 'outgoing', null);
          navigation.navigate('Call', { contact, type: 'outgoing' });
        },
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };
  const renderCall = ({ item }) => {
    const contact = contacts.find(c => c.name === item.name) || { name: item.name };
    return (
      <TouchableOpacity
        style={styles.callItem}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('Call', { contact, type: 'outgoing' })}
      >
        <View style={[styles.avatar, { backgroundColor: contact.profileColor || '#FF3B30' }]}>
          {contact.photoUri ? (
            <Image source={{ uri: contact.photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
          )}
        </View>
      <View style={styles.callContent}>
        <Text style={[styles.callName, item.type === 'missed' && styles.callNameMissed]}>
          {item.name} {item.count && `(${item.count})`}
        </Text>
        <View style={styles.callInfo}>
          <Text style={styles.callType}>
            {item.type === 'outgoing' ? 'Outgoing' : item.type === 'incoming' ? `Incoming (${item.duration})` : 'Missed'}
          </Text>
        </View>
      </View>
      <View style={styles.callRight}>
        <Text style={styles.callDate}>{item.date}</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <View style={styles.filterContainer}>
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.newCallButton} onPress={handleStartCall}>
        <Ionicons name="call-outline" size={22} color="#ffffff" />
        <Text style={styles.newCallText}>Start New Call</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>RECENT CALLS</Text>
      <FlatList
        data={filteredCalls}
        renderItem={renderCall}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No calls yet</Text>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.medium,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    padding: 2,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 18,
  },
  filterButtonActive: {
    backgroundColor: colors.textSecondary,
  },
  filterText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.medium,
  },
  filterTextActive: {
    color: colors.background,
  },
  newCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  newCallText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: typography.medium,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  callItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: typography.medium,
  },
  callContent: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text,
    marginBottom: 2,
  },
  callNameMissed: {
    color: colors.error,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callType: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  callRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  callDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
