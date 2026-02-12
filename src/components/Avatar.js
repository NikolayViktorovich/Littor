import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../theme/colors';
export const Avatar = ({ name, size = 52, online = false, style, photoUri, profileColor }) => {
  const initial = name ? name[0].toUpperCase() : '?';
  const avatarSize = { width: size, height: size, borderRadius: size / 2 };
  const textSize = { fontSize: size * 0.4 };
  const indicatorSize = size * 0.3;
  const backgroundColor = profileColor || colors.surface;
  return (
    <View style={[styles.avatar, avatarSize, { backgroundColor }, style]}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={[styles.avatarImage, avatarSize]} />
      ) : (
        <Text style={[styles.avatarText, textSize, { color: '#ffffff' }]}>
          {initial}
        </Text>
      )}
      {online && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: indicatorSize / 2,
              borderWidth: size > 40 ? 3 : 2,
            },
          ]}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontFamily: typography.medium,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.online,
    borderColor: colors.background,
  },
});
