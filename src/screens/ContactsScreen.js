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
import { SearchBar } from '../components/SearchBar';
import { LiquidGlassButton } from '../components/LiquidGlassButton';
import { Avatar } from '../components/Avatar';
export default function ContactsScreen({ navigation }) {
  const { contacts, createChat, addContact } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);
  const handleContactPress = (contact) => {
    const chat = createChat(contact);
    navigation.navigate('Chat', { chat });
  };
  const handleAddContact = () => {
    Alert.prompt(
      'Новый контакт',
      'Введите имя контакта',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Добавить',
          onPress: (name) => {
            if (name && name.trim()) {
              addContact({ name: name.trim() });
            }
          },
        },
      ],
      'plain-text'
    );
  };
  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
      activeOpacity={0.6}
    >
      <Avatar name={item.name} size={52} online={item.online} style={{ marginRight: 12 }} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={[styles.contactStatus, item.online && styles.contactStatusOnline]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <LiquidGlassButton 
          style={styles.sortButton}
          showBlob={true}
        >
          <View style={styles.sortButtonContent}>
            <Text style={styles.sortButtonText}>Изм.</Text>
          </View>
        </LiquidGlassButton>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Контакты</Text>
        </View>
        <LiquidGlassButton 
          style={styles.addButton} 
          onPress={handleAddContact}
          showBlob={true}
        >
          <View style={styles.addButtonContent}>
            <Ionicons name="add-circle" size={24} color={colors.text} />
          </View>
        </LiquidGlassButton>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Поиск"
        style={styles.searchBar}
      />
      <TouchableOpacity style={styles.inviteButton}>
        <Ionicons name="person-add" size={20} color={colors.primary} />
        <Text style={styles.inviteText}>Пригласить друзей</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Контакты не найдены</Text>
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
    backgroundColor: colors.background,
    position: 'relative',
  },
  sortButton: {
    height: 36,
    minWidth: 90,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginLeft: -12,
  },
  sortButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtonText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.medium,
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    bottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  addButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inviteText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: typography.medium,
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
  contactItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text,
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactStatusOnline: {
    color: '#ffffff',
  },
});
