// External Dependencies
import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../constants/colors';

const commonStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  verticalContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS_LIGHT.white,
  },
});

export { commonStyle };
