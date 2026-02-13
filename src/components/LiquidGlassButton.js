import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

export const LiquidGlassButton = ({ 
  children, 
  onPress, 
  style, 
  activeOpacity = 0.7,
  blurIntensity = 120,
  showBlob = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const blobScaleX = useRef(new Animated.Value(1)).current;
  const blobScaleY = useRef(new Animated.Value(1)).current;
  const blobRotate = useRef(new Animated.Value(0)).current;

  // Извлекаем borderRadius из style если он есть
  const flattenedStyle = StyleSheet.flatten(style);
  const borderRadius = flattenedStyle?.borderRadius || 25;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      showBlob && Animated.spring(blobScaleX, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      showBlob && Animated.spring(blobScaleY, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      showBlob && Animated.spring(blobRotate, {
        toValue: 0.05,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      showBlob && Animated.spring(blobScaleX, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      showBlob && Animated.spring(blobScaleY, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      showBlob && Animated.spring(blobRotate, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
    ]).start();
  };

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(18, 18, 20, 0.2)', 'rgba(255, 255, 255, 0.15)'],
  });

  const blobRotation = blobRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <Animated.View style={[styles.container, style, { transform: [{ scale: scaleAnim }] }]}>
      <BlurView intensity={blurIntensity} tint="dark" style={[styles.blurContainer, { borderRadius }]}>
        {showBlob && (
          <Animated.View
            style={[
              styles.blob,
              {
                borderRadius,
                transform: [
                  { scaleX: blobScaleX },
                  { scaleY: blobScaleY },
                  { rotate: blobRotation },
                ],
              },
            ]}
          />
        )}
        <Animated.View style={[styles.overlay, { backgroundColor, borderRadius }]} />
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={activeOpacity}
        >
          {children}
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  blob: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(60, 60, 67, 0.6)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
});
