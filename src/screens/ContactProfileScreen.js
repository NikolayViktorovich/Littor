import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Share,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, getAvatarColor } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
export default function ContactProfileScreen({ route, navigation }) {
  const { contact } = route.params;
  const { blockUser, unblockUser, chats, deleteChat, clearMessages } = useApp();
  const currentChat = chats.find(c => c.name === contact.name);
  const isBlocked = currentChat?.blocked || false;
  const avatarColor = contact.profileColor || getAvatarColor(contact.name);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
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
  const handleCall = (callType) => {
    navigation.navigate('Call', { contact, type: 'outgoing', callType });
  };
  const handleBlock = () => {
    if (isBlocked) {
      Alert.alert(
        'Разблокировать пользователя',
        `Разблокировать ${contact.name}?`,
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Разблокировать', 
            onPress: () => {
              if (currentChat) unblockUser(currentChat.id);
            }
          },
        ]
      );
    } else {
      Alert.alert(
        'Заблокировать пользователя',
        `Заблокировать ${contact.name}?`,
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Заблокировать', 
            style: 'destructive',
            onPress: () => {
              if (currentChat) blockUser(currentChat.id);
            }
          },
        ]
      );
    }
  };
  const handleNotifications = () => {
    setIsMuted(!isMuted);
    Alert.alert(
      isMuted ? 'Уведомления включены' : 'Уведомления выключены',
      `Уведомления для ${contact.name} теперь ${isMuted ? 'включены' : 'выключены'}`
    );
  };
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Контакт: ${contact.name}\nИмя пользователя: @${contact.username || contact.name.toLowerCase()}`,
        title: 'Поделиться контактом',
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleMoreMenu = () => {
    setMenuVisible(true);
  };
  const handleMenuOption = (option) => {
    setMenuVisible(false);
    switch (option) {
      case 'edit':
        setTimeout(() => {
          Alert.prompt(
            'Редактировать контакт',
            'Введите новое имя контакта',
            [
              { text: 'Отмена', style: 'cancel' },
              { 
                text: 'Сохранить', 
                onPress: (name) => {
                  if (name && name.trim()) {
                    Alert.alert('Готово', `Контакт переименован в ${name.trim()}`);
                  }
                }
              },
            ],
            'plain-text',
            contact.name
          );
        }, 300);
        break;
      case 'export':
        setTimeout(() => {
          Alert.alert(
            'Экспорт чата',
            'Выгрузить историю чата в файл?',
            [
              { text: 'Отмена', style: 'cancel' },
              { 
                text: 'Экспортировать', 
                onPress: () => Alert.alert('Готово', 'Чат успешно экспортирован')
              },
            ]
          );
        }, 300);
        break;
      case 'search':
        navigation.goBack();
        break;
      case 'report':
        setTimeout(() => {
          Alert.alert(
            'Пожаловаться на пользователя',
            `Пожаловаться на ${contact.name} за спам или злоупотребление?`,
            [
              { text: 'Отмена', style: 'cancel' },
              { 
                text: 'Пожаловаться', 
                style: 'destructive',
                onPress: () => Alert.alert('Жалоба отправлена', 'Пользователь отмечен как нарушитель')
              },
            ]
          );
        }, 300);
        break;
    }
  };
  const handleClearChat = () => {
    Alert.alert(
      'Очистить историю чата',
      `Удалить все сообщения с ${contact.name}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Очистить', 
          style: 'destructive',
          onPress: () => {
            if (currentChat) {
              clearMessages(currentChat.id);
              Alert.alert('Готово', 'История чата очищена');
            }
          }
        },
      ]
    );
  };
  const handleDeleteChat = () => {
    Alert.alert(
      'Удалить чат',
      `Удалить чат с ${contact.name}? Это действие нельзя отменить.`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            if (currentChat) {
              deleteChat(currentChat.id);
              navigation.navigate('Main');
              Alert.alert('Готово', 'Чат удалён');
            }
          }
        },
      ]
    );
  };
  const handleChangeChatColor = () => {
    if (currentChat) {
      navigation.navigate('ChatColor', { chatId: currentChat.id });
    } else {
      Alert.alert('Error', 'Chat not found');
    }
  };
  const handleChangeWallpaper = () => {
    if (currentChat) {
      navigation.navigate('ChatWallpaper', { chatId: currentChat.id });
    } else {
      Alert.alert('Error', 'Chat not found');
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={avatarColor} />
      <View style={[styles.topSection, { backgroundColor: avatarColor }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={handleMoreMenu}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Avatar 
              name={contact.name} 
              size={100} 
              photoUri={contact.photoUri}
              profileColor={avatarColor}
            />
          </View>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.status}>
            {isBlocked ? 'заблокирован' : contact.online ? 'в сети' : contact.status || 'был(а) недавно'}
          </Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleCall('audio')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="call" size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>Звонок</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleCall('video')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="videocam" size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>Видео</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleNotifications}
          >
            <View style={styles.actionIcon}>
              <Ionicons name={isMuted ? "notifications-off" : "notifications"} size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>{isMuted ? 'Вкл. звук' : 'Откл. звук'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="share" size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>Поделиться</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color={colors.text} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Телефон</Text>
              <Text style={styles.infoValue}>{contact.phone || '+1 234 567 8900'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="at" size={18} color={colors.text} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Имя пользователя</Text>
              <Text style={styles.infoValue}>@{contact.username || contact.name.toLowerCase()}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={18} color={colors.text} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>О себе</Text>
              <Text style={styles.infoValue}>{contact.bio || 'Пока ничего не указано'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleNotifications}
          >
            <Ionicons 
              name={isMuted ? "notifications-off" : "notifications"} 
              size={18} 
              color={colors.text} 
              style={styles.menuIcon} 
            />
            <Text style={styles.menuText}>Уведомления</Text>
            <Text style={styles.menuValue}>{isMuted ? 'Выкл.' : 'Вкл.'}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleChangeChatColor}
          >
            <Ionicons name="color-palette" size={18} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Цвет чата</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleChangeWallpaper}
          >
            <Ionicons name="image" size={18} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Фон чата</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleClearChat}
          >
            <Ionicons name="trash" size={18} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Очистить историю</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingsItem} onPress={handleBlock}>
            <Ionicons 
              name={isBlocked ? "checkmark-circle" : "ban"} 
              size={18} 
              color={isBlocked ? colors.text : colors.error} 
              style={styles.menuIcon} 
            />
            <Text style={[styles.menuText, !isBlocked && styles.menuTextDanger]}>
              {isBlocked ? 'Разблокировать' : 'Заблокировать'}
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleDeleteChat}
          >
            <Ionicons name="trash" size={18} color={colors.error} style={styles.menuIcon} />
            <Text style={[styles.menuText, styles.menuTextDanger]}>Удалить чат</Text>
          </TouchableOpacity>
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
              onPress={() => handleMenuOption('edit')}
              activeOpacity={0.6}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="create" size={22} color={colors.text} />
                <Text style={styles.menuItemText}>Редактировать контакт</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuOption('search')}
              activeOpacity={0.6}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="search" size={22} color={colors.text} />
                <Text style={styles.menuItemText}>Искать в чате</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuOption('export')}
              activeOpacity={0.6}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="download" size={22} color={colors.text} />
                <Text style={styles.menuItemText}>Экспорт чата</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuOption('report')}
              activeOpacity={0.6}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name="flag" size={22} color={colors.error} />
                <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Пожаловаться</Text>
              </View>
            </TouchableOpacity>
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
  topSection: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarWrapper: {
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#ffffff',
    padding: 2,
  },
  name: {
    fontSize: 22,
    fontFamily: typography.bold,
    color: '#ffffff',
    marginBottom: 3,
    marginTop: 12,
  },
  status: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 4,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionIcon: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginBottom: 6,
    width: '100%',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: typography.medium,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
    width: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginLeft: 44,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuIcon: {
    marginRight: 12,
    width: 20,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  menuValue: {
    fontSize: 15,
    color: colors.textSecondary,
    marginRight: 6,
  },
  menuTextDanger: {
    color: colors.error,
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
