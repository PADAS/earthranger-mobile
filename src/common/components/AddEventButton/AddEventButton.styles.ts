// External Dependencies
import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../constants/colors';

// Internal Dependencies

import { shadowStyles } from '../../style/shadowStyles';

const styles = StyleSheet.create({
  addEventButton: {
    ...shadowStyles.viewDropShadow,
    width: 48,
    height: 48,
    backgroundColor: COLORS_LIGHT.brightBlue,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
