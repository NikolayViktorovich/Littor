import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, themeMode, toggleTheme } = useContext(ThemeContext);
  const { user, signOut } = useContext(AuthContext);

  const settingsSections = [
    {
      title: 'Аккаунт',
      items: [
        { label: 'Имя пользователя', value: user?.username || 'Не указано', action: null },
        { label: 'Номер телефона', value: '+7 (XXX) XXX-XX-XX', action: null },
      ]
    },
    {
      title: 'Внешний вид',
      items: [
        { label: 'Темная тема', type: 'switch', value: isDark, action: () => toggleTheme(isDark ? 'light' : 'dark') },
        { label: 'Автоматическая тема', type: 'switch', value: themeMode === 'auto', action: () => toggleTheme(themeMode === 'auto' ? 'light' : 'auto') },
      ]
    },
    {
      title: 'Уведомления',
      items: [
        { label: 'Звук уведомлений', type: 'switch', value: true, action: () => {} },
        { label: 'Вибрация', type: 'switch', value: true, action: () => {} },
      ]
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Настройки</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={[styles.item, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
              >
                <Text style={[styles.itemLabel, { color: theme.text }]}>{item.label}</Text>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.action}
                    trackColor={{ false: theme.border, true: theme.primary }}
                  />
                ) : (
                  <Text style={[styles.itemValue, { color: theme.textSecondary }]}>
                    {item.value}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          onPress={signOut}
        >
          <Text style={styles.logoutText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  itemLabel: {
    fontSize: 16,
  },
  itemValue: {
    fontSize: 16,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
