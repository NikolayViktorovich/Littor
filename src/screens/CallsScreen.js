import { useState, useMemo } from 'react';
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
          Alert.alert('Call Started', `Calling ${contact.name}...`);
        },
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const renderCall = ({ item }) => (
    <TouchableOpacity
      style={styles.callItem}
      activeOpacity={0.6}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
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
    fontWeight: '500',
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
    fontWeight: '500',
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
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
  },
  callContent: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '500',
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
