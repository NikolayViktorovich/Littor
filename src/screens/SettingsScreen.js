import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
const MENU_ITEMS = [
  { id: '1', icon: 'person-outline', title: 'My Profile', hasArrow: true, action: 'profile' },
  { id: '2', icon: 'bookmark-outline', title: 'Saved Messages', hasArrow: true, action: 'saved' },
  { id: '3', icon: 'call-outline', title: 'Recent Calls', hasArrow: true, action: 'calls' },
  { id: '4', icon: 'phone-portrait-outline', title: 'Devices', hasArrow: true, action: 'devices' },
  { id: '5', icon: 'notifications-outline', title: 'Notifications', hasArrow: true, action: 'notifications' },
  { id: '6', icon: 'lock-closed-outline', title: 'Privacy & Security', hasArrow: true, action: 'privacy' },
  { id: '7', icon: 'folder-outline', title: 'Data & Storage', hasArrow: true, action: 'data' },
  { id: '8', icon: 'help-circle-outline', title: 'Help', hasArrow: true, action: 'help' },
];
export default function SettingsScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (menuVisible) {
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
  }, [menuVisible]);
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
  const handleChangePhoto = () => {
    setMenuVisible(true);
  };
  const handleMenuOption = (option) => {
    setMenuVisible(false);
    if (option === 'choose') {
      setTimeout(() => navigation.navigate('ProfilePhoto'), 300);
    } else if (option === 'remove') {
      updateProfile({ photoUri: null });
    }
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
    } else if (item.action === 'notifications') {
      navigation.navigate('Notifications');
    } else if (item.action === 'privacy') {
      navigation.navigate('PrivacySecurity');
    } else if (item.action === 'data') {
      navigation.navigate('DataStorage');
    } else if (item.action === 'help') {
      navigation.navigate('Help');
    } else {
      Alert.alert('Coming Soon', `${item.title} feature is under development`);
    }
  };
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const MenuItem = ({ icon, title, badge, hasArrow, action }) => (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={() => handleMenuItemPress({ icon, title, badge, hasArrow, action })}
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <View style={styles.menuRight}>
        {badge && <Text style={styles.menuBadge}>{badge}</Text>}
        {hasArrow && <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />}
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>Settings</Text>
      </Animated.View>
      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={[styles.profileAvatar, { backgroundColor: profile.profileColor || '#FF3B30' }]}
            onPress={handleChangePhoto}
            activeOpacity={0.8}
          >
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.profileAvatarImage} />
            ) : (
              <Text style={styles.profileAvatarText}>{profile.avatar}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.7}>
            <Text style={styles.profileName}>{profile.name}</Text>
          </TouchableOpacity>
          <Text style={styles.profileDetails}>
            {profile.phone} • @{profile.username}
          </Text>
          {profile.bio && (
            <Text style={styles.profileBio}>{profile.bio}</Text>
          )}
        </View>
        <View style={styles.customizeSection}>
          <Text style={styles.sectionTitle}>CUSTOMIZE</Text>
          <View style={styles.customizeCard}>
            <TouchableOpacity 
              style={styles.customizeItem} 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ProfileColor')}
            >
              <View style={styles.customizeIconContainer}>
                <View style={[styles.colorPreview, { backgroundColor: profile.profileColor || '#FF3B30' }]}>
                  <Ionicons name="color-palette" size={20} color="#ffffff" />
                </View>
              </View>
              <View style={styles.customizeContent}>
                <Text style={styles.customizeTitle}>Profile Color</Text>
                <Text style={styles.customizeSubtitle}>Personalize your profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
            </TouchableOpacity>
            <View style={styles.customizeDivider} />
            <TouchableOpacity 
              style={styles.customizeItem} 
              activeOpacity={0.7}
              onPress={handleChangePhoto}
            >
              <View style={styles.customizeIconContainer}>
                <View style={styles.photoPreview}>
                  {profile.photoUri ? (
                    <Image source={{ uri: profile.photoUri }} style={styles.photoPreviewImage} />
                  ) : (
                    <View style={[styles.photoPreviewPlaceholder, { backgroundColor: profile.profileColor || '#FF3B30' }]}>
                      <Text style={styles.photoPreviewText}>{profile.avatar}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.customizeContent}>
                <Text style={styles.customizeTitle}>Profile Photo</Text>
                <Text style={styles.customizeSubtitle}>Change your avatar</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <View key={item.id}>
                <MenuItem {...item} />
                {index < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Littor Messenger</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </Animated.ScrollView>
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
        </TouchableOpacity>
        <Animated.View 
          style={[
            styles.menuContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.menu}>
            <TouchableOpacity 
              style={styles.menuItem2}
              onPress={() => handleMenuOption('choose')}
              activeOpacity={0.6}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="images-outline" size={22} color={colors.text} />
                <Text style={styles.menuItemText}>Выбрать изображение</Text>
              </View>
            </TouchableOpacity>
            {profile.photoUri && (
              <>
                <View style={styles.menuDivider2} />
                <TouchableOpacity 
                  style={styles.menuItem2}
                  onPress={() => handleMenuOption('remove')}
                  activeOpacity={0.6}
                >
                  <View style={styles.menuItemContent}>
                    <Ionicons name="trash-outline" size={22} color={colors.error} />
                    <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Удалить изображение</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
  },
  profileAvatarText: {
    fontSize: 36,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  profileBio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 24,
    lineHeight: 18,
  },
  customizeSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: typography.bold,
    color: colors.textSecondary,
    paddingHorizontal: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  customizeCard: {
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  customizeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  customizeIconContainer: {
    marginRight: 12,
  },
  colorPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
  },
  photoPreviewPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreviewText: {
    fontSize: 20,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
  customizeContent: {
    flex: 1,
  },
  customizeTitle: {
    fontSize: 15,
    fontFamily: typography.medium,
    color: colors.text,
    marginBottom: 1,
  },
  customizeSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  customizeDivider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginLeft: 68,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuCard: {
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontFamily: typography.medium,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuBadge: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginLeft: 60,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 80,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  footerVersion: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  menu: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  menuItem2: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: typography.regular,
    color: colors.text,
  },
  menuItemTextDanger: {
    color: colors.error,
  },
  menuDivider2: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 6,
    marginHorizontal: 20,
  },
});
