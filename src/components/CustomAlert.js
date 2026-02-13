import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export default function CustomAlert({ 
  visible, 
  onClose, 
  title, 
  message, 
  buttons = [],
  icon = null,
  iconColor = colors.primary,
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
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
        Animated.timing(scaleAnim, {
          toValue: 0,
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
  const handleButtonPress = (button) => {
    if (button.onPress) {
      button.onPress();
    }
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
          styles.alertContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
        ]}
      >
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={48} color={iconColor} />
          </View>
        )}
        {title && <Text style={styles.alertTitle}>{title}</Text>}
        {message && <Text style={styles.alertMessage}>{message}</Text>}
        <View style={styles.buttonsContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.alertButton,
                button.style === 'destructive' && styles.alertButtonDestructive,
                button.style === 'cancel' && styles.alertButtonCancel,
                buttons.length === 1 && styles.alertButtonSingle,
              ]}
              onPress={() => handleButtonPress(button)}
            >
              <Text 
                style={[
                  styles.alertButtonText,
                  button.style === 'destructive' && styles.alertButtonTextDestructive,
                  button.style === 'cancel' && styles.alertButtonTextCancel,
                ]}
              >
                {button.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  alertContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: colors.surface,
    borderRadius: 25,
    padding: 16,
    alignSelf: 'center',
    top: '40%',
    left: SCREEN_WIDTH * 0.15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  alertMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  alertButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 48,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  alertButtonSingle: {
    flex: 1,
  },
  alertButtonCancel: {
    backgroundColor: colors.surfaceLight,
  },
  alertButtonDestructive: {
    backgroundColor: colors.error,
  },
  alertButtonText: {
    fontSize: 14,
    fontFamily: typography.semiBold,
    color: '#000000',
  },
  alertButtonTextCancel: {
    color: colors.text,
  },
  alertButtonTextDestructive: {
    color: '#ffffff',
  },
});
