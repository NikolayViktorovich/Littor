import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const Avatar = ({ name, size = 52, online = false, style }) => {
  const initial = name ? name[0].toUpperCase() : '?';
  const avatarSize = { width: size, height: size, borderRadius: size / 2 };
  const textSize = { fontSize: size * 0.4 };
  const indicatorSize = size * 0.3;

  return (
    <View style={[styles.avatar, avatarSize, style]}>
      <Text style={[styles.avatarText, textSize]}>{initial}</Text>
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#000000',
    fontWeight: '500',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.online,
    borderColor: colors.background,
  },
});
