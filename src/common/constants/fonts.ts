type TFontWeightValue = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type TFontWeightName = 'normal' | 'medium' | 'semiBold' | 'bold';
type TFontSizeName = 'medium' | 'standard' | 'large' | 'larger' | 'huge' | 'massive';
type TLineHeightName = 'medium' | 'standard' | 'large' | 'huge' | 'massive';

const MAX_FONT_SIZE_MULTIPLIER = 1.1;

const fontSize: Record<TFontSizeName, number> = {
  medium: 12,
  standard: 14,
  large: 16,
  larger: 17,
  huge: 18,
  massive: 25,
};

const lineHeight: Record<TLineHeightName, number> = {
  medium: 14,
  standard: 16,
  large: 18,
  huge: 21,
  massive: 25,
};

const fontWeight: Record<TFontWeightName, TFontWeightValue> = {
  normal: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export {
  fontSize,
  lineHeight,
  fontWeight,
  MAX_FONT_SIZE_MULTIPLIER,
};
