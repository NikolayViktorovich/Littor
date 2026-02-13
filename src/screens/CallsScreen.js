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
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { LiquidGlassButton } from '../components/LiquidGlassButton';
import { Avatar } from '../components/Avatar';
export default function CallsScreen({ navigation }) {
  const { calls, contacts, addCall } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const filteredCalls = useMemo(() => {
    if (selectedFilter === 'all') return calls;
    return calls.filter(call => call.type === 'missed');
  }, [calls, selectedFilter]);
  const handleStartCall = () => {
    if (contacts.length === 0) {
      Alert.alert('Нет контактов', 'Сначала добавьте контакты для звонка');
      return;
    }
    Alert.alert(
      'Начать звонок',
      'Выберите контакт',
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
        <Avatar 
          name={item.name} 
          size={44} 
          photoUri={contact.photoUri}
          profileColor={contact.profileColor}
          style={{ marginRight: 12 }}
        />
      <View style={styles.callContent}>
        <Text style={[styles.callName, item.type === 'missed' && styles.callNameMissed]}>
          {item.name} {item.count && `(${item.count})`}
        </Text>
        <View style={styles.callInfo}>
          <Text style={styles.callType}>
            {item.type === 'outgoing' ? 'Исходящий' : item.type === 'incoming' ? `Входящий (${item.duration})` : 'Пропущенный'}
          </Text>
        </View>
      </View>
      <View style={styles.callRight}>
        <Text style={styles.callDate}>{item.date}</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <LiquidGlassButton 
          style={styles.editButton}
          showBlob={true}
        >
          <View style={styles.editButtonContent}>
            <Text style={styles.editButtonText}>Изм.</Text>
          </View>
        </LiquidGlassButton>
        <View style={styles.filterTabContainer}>
          <TouchableOpacity
            style={styles.filterTab}
            onPress={() => setSelectedFilter('all')}
            activeOpacity={0.7}
          >
            {selectedFilter === 'all' && <View style={styles.filterBlob} />}
            <Text style={[
              styles.filterText,
              selectedFilter === 'all' && styles.filterTextActive
            ]}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterTab}
            onPress={() => setSelectedFilter('missed')}
            activeOpacity={0.7}
          >
            {selectedFilter === 'missed' && <View style={styles.filterBlob} />}
            <Text style={[
              styles.filterText,
              selectedFilter === 'missed' && styles.filterTextActive
            ]}>
              Пропущ.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.newCallButton} 
        onPress={handleStartCall}
        activeOpacity={0.6}
      >
        <Ionicons name="call" size={20} color={colors.primary} />
        <Text style={styles.newCallText}>Новый звонок</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>НЕДАВНИЕ ЗВОНКИ</Text>
      <FlatList
        data={filteredCalls}
        renderItem={renderCall}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Звонков пока нет</Text>
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
    height: 36,
    minWidth: 90,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginLeft: -12,
  },
  editButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.medium,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTabContainer: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(18, 18, 20, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 0,
  },
  filterTab: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 24,
    minWidth: 80,
  },
  filterBlob: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(60, 60, 67, 0.6)',
    borderRadius: 14,
    margin: 2,
  },
  filterButton: {
    height: 36,
    minWidth: 100,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  filterButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    // Стиль для активной кнопки (блоб будет виден)
  },
  filterText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.medium,
    letterSpacing: 0.3,
  },
  filterTextActive: {
    color: colors.text,
    fontFamily: typography.semiBold,
    letterSpacing: 0.3,
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
    color: colors.primary,
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
    paddingVertical: 8,
    alignItems: 'center',
  },
  callContent: {
    flex: 1,
  },
  callName: {
    fontSize: 15,
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
    fontSize: 13,
    color: colors.textSecondary,
  },
  callRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  callDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
