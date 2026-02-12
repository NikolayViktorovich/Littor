import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';
export const EmptyState = ({ icon, title, subtitle }) => {
  return (
    <View style={styles.container}>
      {icon && <Ionicons name={icon} size={48} color={colors.textTertiary} />}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: typography.medium,
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 6,
    textAlign: 'center',
  },
});
