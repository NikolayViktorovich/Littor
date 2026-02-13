import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
  { id: '1', icon: 'person', title: 'Профиль', hasArrow: true, action: 'profile', color: '#0A84FF' },
  { id: '2', icon: 'wallet', title: 'Кошелёк', hasArrow: true, action: 'wallet', color: '#FF9500' },
  { id: '3', icon: 'bookmark', title: 'Сохранённые сообщения', hasArrow: true, action: 'saved', color: '#5856D6' },
  { id: '4', icon: 'call', title: 'Недавние звонки', hasArrow: true, action: 'calls', color: '#34C759' },
  { id: '5', icon: 'phone-portrait', title: 'Устройства', hasArrow: true, action: 'devices', color: '#FF2D55' },
  { id: '6', icon: 'notifications', title: 'Уведомления', hasArrow: true, action: 'notifications', color: '#FF3B30' },
  { id: '7', icon: 'lock-closed', title: 'Приватность и безопасность', hasArrow: true, action: 'privacy', color: '#FF9500' },
  { id: '8', icon: 'folder', title: 'Данные и память', hasArrow: true, action: 'data', color: '#32ADE6' },
  { id: '9', icon: 'help-circle', title: 'Помощь', hasArrow: true, action: 'help', color: '#0A84FF' },
];
const CUSTOMIZE_ITEMS = [
  { id: 'c2', icon: 'color-palette', title: 'Цвет профиля', action: 'color', color: '#AF52DE' },
  { id: 'c3', icon: 'camera', title: 'Фото профиля', action: 'photo', color: '#5856D6' },
];
export default function SettingsScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const accentColor = profile.profileColor || '#0A84FF';
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
      'Имя профиля',
      'Введите новое имя',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сохранить',
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
    if (item.action === 'color') {
      navigation.navigate('ProfileColor');
      return;
    }
    if (item.action === 'photo') {
      handleChangePhoto();
      return;
    }
    if (item.action === 'wallet') {
      Alert.alert('Скоро', 'Кошелёк сейчас в разработке');
      return;
    }
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
      Alert.alert('Скоро', 'Кошелёк сейчас в разработке');
    }
  };
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const MenuItem = ({ icon, title, hasArrow, action, color }) => (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.6}
      onPress={() => handleMenuItemPress({ icon, title, hasArrow, action })}
    >
      <View style={[styles.iconContainer, { backgroundColor: color || '#0A84FF' }]}>
        <Ionicons name={icon} size={20} color="#ffffff" />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      {hasArrow && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />}
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerSide} />
          <Text style={styles.headerTitle}>Настройки</Text>
          <TouchableOpacity style={styles.headerAction} onPress={handleEditProfile} activeOpacity={0.8}>
            <Text style={styles.headerActionText}>Править</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={[styles.profileAvatar, { backgroundColor: accentColor }]}
            onPress={handleChangePhoto}
            activeOpacity={0.8}
          >
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.profileAvatarImage} />
            ) : (
              <Text style={styles.profileAvatarText}>{profile.avatar}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileDetails}>
            {profile.phone} • @{profile.username}
          </Text>
          {profile.bio && (
            <Text style={styles.profileBio} numberOfLines={2}>
              {profile.bio}
            </Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>АККАУНТ</Text>
          <View style={styles.sectionCard}>
            {CUSTOMIZE_ITEMS.map((item, index) => (
              <View key={item.id}>
                <MenuItem
                  icon={item.icon}
                  title={item.title}
                  hasArrow
                  action={item.action}
                />
                {index < CUSTOMIZE_ITEMS.length - 1 && <View style={styles.menuDivider} />}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>НАСТРОЙКИ</Text>
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
          <Text style={styles.footerVersion}>Версия 1.0.0</Text>
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
                <Ionicons name="images" size={22} color={colors.text} />
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
                    <Ionicons name="trash" size={22} color={colors.error} />
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    width: 48,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  headerAction: {
    width: 48,
    alignItems: 'flex-end',
  },
  headerActionText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: typography.medium,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 72,
    paddingBottom: 90,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
  },
  profileAvatarText: {
    fontSize: 30,
    fontFamily: typography.semiBold,
    color: '#ffffff',
  },
  profileName: {
    fontSize: 20,
    fontFamily: typography.bold,
    color: colors.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  profileBio: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: typography.bold,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  section: {
    marginBottom: 16,
  },
  sectionCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  menuSection: {
    marginBottom: 16,
  },
  menuCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    color: colors.text,
    fontFamily: typography.regular,
    flex: 1,
  },
  menuDivider: {
    height: 0.33,
    backgroundColor: colors.separator,
    marginLeft: 56,
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
