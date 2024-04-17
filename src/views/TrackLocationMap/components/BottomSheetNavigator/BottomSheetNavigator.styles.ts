// External Dependencies
import { StyleSheet } from 'react-native';
import {
  DefaultTheme,
} from '@react-navigation/native';

// Internal Dependencies
import { shadowStyles } from '../../../../common/style/shadowStyles';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const styles = StyleSheet.create({
  bottomSheet: {
    ...shadowStyles.viewDropShadow,
  },
  background: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: COLORS_LIGHT.white,
  },
});

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS_LIGHT.transparent,
  },
};

export default styles;
