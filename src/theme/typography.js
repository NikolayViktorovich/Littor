export const typography = {
  light: 'Manrope-Light',
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semiBold: 'Manrope-SemiBold',
  bold: 'Manrope-Bold',
  extraBold: 'Manrope-ExtraBold',
};
export const fontStyle = (weight = 'regular') => ({
  fontFamily: typography[weight],
});
