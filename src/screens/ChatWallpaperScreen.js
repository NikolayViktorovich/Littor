import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography } from '../theme/colors';
import { useApp } from '../context/AppContext';
export default function ChatWallpaperScreen({ route, navigation }) {
  const { chatId } = route.params;
  const { chats, updateChatWallpaper } = useApp();
  const chat = chats.find(c => c.id === chatId);
  const [customImage, setCustomImage] = useState(chat?.wallpaperUri || null);
  const [brightness, setBrightness] = useState(chat?.wallpaperBrightness ?? 1);
  const [blur, setBlur] = useState(chat?.wallpaperBlur ?? 0);
  const [opacity, setOpacity] = useState(chat?.wallpaperOpacity ?? 1);
  const handleSave = () => {
    updateChatWallpaper(chatId, customImage ? 'custom' : 'none', customImage, {
      brightness,
      blur,
      opacity,
    });
    navigation.goBack();
  };
  const handleRemoveWallpaper = () => {
    setCustomImage(null);
    setBrightness(1);
    setBlur(0);
    setOpacity(1);
  };
  const handleResetSettings = () => {
    setBrightness(1);
    setBlur(0);
    setOpacity(1);
  };
  const handleChooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery permission is required to choose wallpapers.');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setCustomImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to choose wallpaper. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Wallpaper</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {customImage ? (
          <>
            <View style={styles.previewSection}>
              <View style={styles.previewContainer}>
                <Image 
                  source={{ uri: customImage }} 
                  style={[
                    styles.previewWallpaper,
                    {
                      opacity: opacity,
                    }
                  ]} 
                  resizeMode="cover"
                  blurRadius={blur}
                />
                <View style={[styles.brightnessOverlay, { opacity: 1 - brightness }]} />
                <View style={styles.previewChat}>
                  <View style={styles.previewBubbleIncoming}>
                    <Text style={styles.previewTextIncoming}>Check out this wallpaper!</Text>
                    <Text style={styles.previewTime}>12:30</Text>
                  </View>
                  <View style={styles.previewBubbleOwn}>
                    <Text style={styles.previewTextOwn}>Looks great! 😍</Text>
                    <View style={styles.previewFooter}>
                      <Text style={styles.previewTimeOwn}>12:31</Text>
                      <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.7)" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.controlsSection}>
              <View style={styles.controlGroup}>
                <View style={styles.controlHeader}>
                  <Ionicons name="sunny-outline" size={20} color={colors.text} />
                  <Text style={styles.controlLabel}>Brightness</Text>
                  <Text style={styles.controlValue}>{Math.round(brightness * 100)}%</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0.3}
                  maximumValue={1.5}
                  value={brightness}
                  onValueChange={setBrightness}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.surfaceLight}
                  thumbTintColor={colors.primary}
                />
              </View>
              <View style={styles.controlGroup}>
                <View style={styles.controlHeader}>
                  <Ionicons name="water-outline" size={20} color={colors.text} />
                  <Text style={styles.controlLabel}>Blur</Text>
                  <Text style={styles.controlValue}>{Math.round(blur)}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={20}
                  value={blur}
                  onValueChange={setBlur}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.surfaceLight}
                  thumbTintColor={colors.primary}
                />
              </View>
              <View style={styles.controlGroup}>
                <View style={styles.controlHeader}>
                  <Ionicons name="contrast-outline" size={20} color={colors.text} />
                  <Text style={styles.controlLabel}>Opacity</Text>
                  <Text style={styles.controlValue}>{Math.round(opacity * 100)}%</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0.2}
                  maximumValue={1}
                  value={opacity}
                  onValueChange={setOpacity}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.surfaceLight}
                  thumbTintColor={colors.primary}
                />
              </View>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleResetSettings}
              >
                <Ionicons name="refresh-outline" size={20} color={colors.text} />
                <Text style={styles.resetButtonText}>Reset Settings</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="image-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No wallpaper selected</Text>
            <Text style={styles.emptyStateSubtext}>Choose an image from your gallery</Text>
          </View>
        )}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleChooseFromGallery}
          >
            <Ionicons name="images" size={22} color={colors.text} />
            <Text style={styles.actionButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
          {customImage && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.removeButton]}
              onPress={handleRemoveWallpaper}
            >
              <Ionicons name="trash-outline" size={22} color={colors.error} />
              <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove Wallpaper</Text>
            </TouchableOpacity>
          )}
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
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: typography.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 17,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  previewSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  previewContainer: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  previewWallpaper: {
    ...StyleSheet.absoluteFillObject,
  },
  brightnessOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  previewGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  previewChat: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 12,
  },
  previewBubbleIncoming: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: '75%',
  },
  previewBubbleOwn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
    maxWidth: '75%',
  },
  previewTextIncoming: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 2,
  },
  previewTextOwn: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 2,
  },
  previewTime: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  previewTimeOwn: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: typography.semiBold,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  removeButtonText: {
    color: colors.error,
  },
  controlsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  controlGroup: {
    gap: 12,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  controlValue: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: colors.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 15,
    color: colors.text,
    fontFamily: typography.semiBold,
  },
});
