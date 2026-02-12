import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useEffect, useRef } from 'react';

export const ChatMenu = ({ visible, onClose, onSelectOption, isBlocked }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  const menuItems = [
    { id: 'wallpaper', icon: 'brush-outline', title: 'Change Wallpaper', color: colors.text },
    { id: 'secret', icon: 'lock-closed-outline', title: 'Start Secret Chat', color: colors.text },
    { id: 'share', icon: 'share-outline', title: 'Share Contact', color: colors.text },
    { id: 'divider' },
    { id: 'clear', icon: 'trash-outline', title: 'Clear Messages', color: colors.text },
    { 
      id: 'block', 
      icon: isBlocked ? 'checkmark-circle-outline' : 'hand-left-outline', 
      title: isBlocked ? 'Unblock User' : 'Block User', 
      color: colors.error 
    },
  ];

  const handleSelect = (id) => {
    onSelectOption(id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.menuContainer,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <BlurView intensity={80} tint="dark" style={styles.menu}>
          {menuItems.map((item, index) => {
            if (item.id === 'divider') {
              return <View key={index} style={styles.divider} />;
            }

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.6}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                  <Text style={[styles.menuItemText, { color: item.color }]}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  menu: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: '400',
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.separator,
    marginVertical: 8,
    marginHorizontal: 24,
  },
});
