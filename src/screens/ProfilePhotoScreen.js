import { useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
export default function ProfilePhotoScreen({ navigation }) {
  const { updateProfile } = useApp();
  useEffect(() => {
    openGallery();
  }, []);
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Требуется разрешение', 'Для выбора фото нужен доступ к галерее.');
      return false;
    }
    return true;
  };
  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      navigation.goBack();
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        updateProfile({ photoUri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выбрать фото. Попробуйте снова.');
    } finally {
      navigation.goBack();
    }
  };
  return <View style={{ flex: 1, backgroundColor: 'transparent' }} />;
}
