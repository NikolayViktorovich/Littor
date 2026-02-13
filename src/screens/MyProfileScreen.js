import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
export default function MyProfileScreen({ navigation }) {
  const { profile, updateProfile } = useApp();
  const accentColor = profile.profileColor || colors.primary;
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || '');
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
  const handleSaveName = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
      setIsEditingName(false);
      Alert.alert('Готово', 'Имя обновлено');
    }
  };
  const handleSaveBio = () => {
    updateProfile({ bio: bio.trim() });
    setIsEditingBio(false);
    Alert.alert('Готово', 'Статус обновлён');
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
          <Text style={styles.headerTitle}>Профиль</Text>
          <View style={styles.headerRight} />
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={[styles.profileAvatar, { backgroundColor: accentColor }]} 
            onPress={handleChangePhoto}
          >
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.profileAvatarImage} />
            ) : (
              <Text style={styles.profileAvatarText}>{profile.avatar}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.profileSubtitle}>Так вы выглядите для других</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Данные профиля</Text>
          <Text style={styles.sectionSubtitle}>Основная информация, которую видят другие</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Имя</Text>
              {isEditingName ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    placeholder="Введите имя"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                    <Ionicons name="checkmark" size={24} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => {
                      setName(profile.name);
                      setIsEditingName(false);
                    }} 
                    style={styles.cancelButton}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.infoValueContainer}
                  onPress={() => setIsEditingName(true)}
                >
                  <Text style={styles.infoValue}>{profile.name}</Text>
                  <Ionicons name="create" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Телефон</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Имя пользователя</Text>
              <Text style={styles.infoValue}>@{profile.username}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О себе</Text>
          <Text style={styles.sectionSubtitle}>Короткая строка, которая звучит как вы</Text>
          <View style={styles.card}>
            {isEditingBio ? (
              <View style={styles.bioEditContainer}>
                <TextInput
                  style={styles.bioInput}
                  value={bio}
                  onChangeText={setBio}
                  autoFocus
                  multiline
                  placeholder="Расскажите немного о себе"
                  placeholderTextColor={colors.textTertiary}
                  maxLength={70}
                />
                <View style={styles.bioActions}>
                  <Text style={styles.bioCounter}>{bio.length}/70</Text>
                  <View style={styles.bioButtons}>
                    <TouchableOpacity onPress={handleSaveBio} style={styles.saveButton}>
                      <Ionicons name="checkmark" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => {
                        setBio(profile.bio || '');
                        setIsEditingBio(false);
                      }} 
                      style={styles.cancelButton}
                    >
                      <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.bioContainer}
                onPress={() => setIsEditingBio(true)}
              >
                <Text style={styles.bioText}>
                  {profile.bio || 'Расскажите немного о себе'}
                </Text>
                <Ionicons name="create" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
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
              style={styles.menuItem}
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
                <View style={styles.menuDivider} />
                <TouchableOpacity 
                  style={styles.menuItem}
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
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
  },
  profileAvatarText: {
    fontSize: 36,
    fontFamily: typography.medium,
    color: '#ffffff',
  },
  profileSubtitle: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: typography.regular,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: typography.semiBold,
    color: colors.textSecondary,
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: typography.regular,
    color: colors.textTertiary,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    marginHorizontal: 12,
    borderRadius: 20,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 15,
    color: colors.text,
  },
  infoValue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 6,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  editInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    padding: 6,
    backgroundColor: colors.inputBg,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    padding: 3,
  },
  cancelButton: {
    padding: 3,
  },
  bioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bioText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  bioEditContainer: {
    gap: 10,
  },
  bioInput: {
    color: colors.text,
    fontSize: 15,
    padding: 10,
    backgroundColor: colors.inputBg,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  bioActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bioCounter: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bioButtons: {
    flexDirection: 'row',
    gap: 10,
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
  menuItem: {
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
  menuDivider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 6,
    marginHorizontal: 20,
  },
});
