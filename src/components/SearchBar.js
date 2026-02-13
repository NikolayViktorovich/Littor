import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
import { useRef, useEffect } from 'react';
export const SearchBar = ({ value, onChangeText, placeholder = 'Search', style, autoFocus = false, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const closeButtonTranslateAnim = useRef(new Animated.Value(50)).current;
  const closeButtonOpacity = useRef(new Animated.Value(0)).current;
  const closeButtonScaleAnim = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    if (value.length > 0) {
      Animated.parallel([
        Animated.spring(closeButtonTranslateAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 150,
          friction: 10,
        }),
        Animated.timing(closeButtonOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(closeButtonScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 10,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(closeButtonTranslateAnim, {
          toValue: 50,
          useNativeDriver: true,
          tension: 150,
          friction: 10,
        }),
        Animated.timing(closeButtonOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(closeButtonScaleAnim, {
          toValue: 0.5,
          useNativeDriver: true,
          tension: 150,
          friction: 10,
        }),
      ]).start();
    }
  }, [value]);
  const handlePress = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };
  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(18, 18, 20, 0.2)', 'rgba(255, 255, 255, 0.15)'],
  });
  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View 
        style={[
          styles.container,
          value.length > 0 && styles.containerWithButton,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <BlurView intensity={120} tint="dark" style={styles.blurContainer}>
          <Animated.View style={[styles.glassOverlay, { backgroundColor }]} />
          <View style={styles.content}>
            <Ionicons name="search" size={16} color={colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={colors.textTertiary}
              value={value}
              onChangeText={onChangeText}
              onPressIn={handlePress}
              autoFocus={autoFocus}
            />
          </View>
        </BlurView>
      </Animated.View>
      <Animated.View
        style={[
          styles.closeButtonContainer,
          {
            opacity: closeButtonOpacity,
            transform: [
              { translateX: closeButtonTranslateAnim },
              { scale: closeButtonScaleAnim },
            ],
          },
        ]}
        pointerEvents={value.length > 0 ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          onPress={() => {
            onChangeText('');
            if (onClose) {
              onClose();
            }
          }} 
          style={styles.closeButtonWrapper}
        >
          <BlurView intensity={120} tint="dark" style={styles.closeButton}>
            <View style={styles.closeButtonOverlay} />
            <Ionicons name="close" size={16} color={colors.text} />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 40,
  },
  container: {
    width: '100%',
    borderRadius: 27,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  containerWithButton: {
    width: '88%',
  },
  blurContainer: {
    borderRadius: 27,
    overflow: 'hidden',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 27,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontFamily: typography.regular,
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButtonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  closeButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 20, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
  },
});
