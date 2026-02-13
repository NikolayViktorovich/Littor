export const colors = {
  background: '#000000',
  surface: '#1c1c1e',
  surfaceLight: '#2c2c2e',
  card: '#1c1c1e',
  border: '#2c2c2e',
  text: '#ffffff',
  textSecondary: '#8e8e93',
  textTertiary: '#636366',
  primary: '#0A84FF',
  primaryDark: '#0056D6',
  online: '#00c853',
  error: '#ff3b30',
  success: '#34c759',
  badge: '#FF3B30',
  verified: '#30D158',
  muted: '#8e8e93',
  inputBg: '#1c1c1e',
  separator: '#38383a',
};

export const avatarColors = [
  '#FF6B6B', // красный
  '#4ECDC4', // бирюзовый
  '#45B7D1', // голубой
  '#FFA07A', // лососевый
  '#98D8C8', // мятный
  '#F7DC6F', // желтый
  '#BB8FCE', // фиолетовый
  '#85C1E2', // светло-голубой
  '#F8B739', // оранжевый
  '#52B788', // зеленый
  '#E76F51', // терракотовый
  '#2A9D8F', // темно-бирюзовый
  '#E9C46A', // золотистый
  '#F4A261', // персиковый
  '#8E7CC3', // лавандовый
  '#6A994E', // оливковый
  '#BC4749', // бордовый
  '#4A90E2', // синий
  '#FF8C42', // яркий оранжевый
  '#7B68EE', // средне-фиолетовый
];

export const getAvatarColor = (name) => {
  if (!name) return colors.surface;
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};
export const typography = {
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
};
