// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { IS_ANDROID } from '../constants/constants';
import { COLORS_LIGHT } from '../constants/colors';

export const shadowStyles = StyleSheet.create({
  viewDropShadow: {
    shadowColor: COLORS_LIGHT.G0_black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: IS_ANDROID ? 0.8 : 0.5,
    shadowRadius: IS_ANDROID ? 5 : 2,
    elevation: 5,
  },
});
