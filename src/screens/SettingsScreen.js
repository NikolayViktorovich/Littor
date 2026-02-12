import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

const MENU_ITEMS = [
  { id: '1', icon: 'person', title: 'My Profile', hasArrow: true, action: 'profile' },
  { id: '2', icon: 'bookmark', title: 'Saved Messages', hasArrow: true, action: 'saved' },
  { id: '3', icon: 'call', title: 'Recent Calls', hasArrow: true, action: 'calls' },
  { id: '4', icon: 'phone-portrait', title: 'Devices', hasArrow: true, action: 'devices' },
];

export default function SettingsScreen({ navigation }) {
  const { profile, updateProfile } = useApp();

  const handleEditProfile = () => {
    Alert.prompt(
      'Edit Name',
      'Enter your new name',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (name) => {
            if (name && name.trim()) {
              updateProfile({ name: name.trim() });
            }
          },
        },
      ],
      'plain-text',
      profile.name
    );
  };

  const handleMenuItemPress = (item) => {
    if (item.action === 'profile') {
      navigation.navigate('MyProfile');
    } else if (item.action === 'saved') {
      navigation.navigate('SavedMessages');
    } else if (item.action === 'calls') {
      navigation.navigate('Calls');
    } else if (item.action === 'devices') {
      navigation.navigate('Devices');
    } else {
      Alert.alert('Coming Soon', `${item.title} feature is under development`);
    }
  };
  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Photo picker coming soon!');
  };

  const MenuItem = ({ icon, title, badge, hasArrow, action }) => (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.6}
      onPress={() => handleMenuItemPress({ icon, title, badge, hasArrow, action })}
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color={colors.text} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <View style={styles.menuRight}>
        {badge && <Text style={styles.menuBadge}>{badge}</Text>}
        {hasArrow && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  const ActionButton = ({ icon, title, color, action }) => (
    <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.actionTitle, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.qrButton}>
          <Ionicons name="qr-code-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{profile.avatar}</Text>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileDetails}>
              {profile.phone} • @{profile.username}
            </Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
            <Ionicons name="color-palette-outline" size={22} color={colors.text} />
            <Text style={styles.actionTitle}>Change Profile Color</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.6} onPress={handleChangePhoto}>
            <Ionicons name="camera-outline" size={22} color={colors.text} />
            <Text style={styles.actionTitle}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <View key={item.id}>
              <MenuItem {...item} />
              {index < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>
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
  qrButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 40,
    fontWeight: '500',
    color: '#000000',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileBadge: {
    fontSize: 14,
  },
  profileDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  actionDivider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginLeft: 50,
  },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBadge: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginLeft: 64,
  },
});
