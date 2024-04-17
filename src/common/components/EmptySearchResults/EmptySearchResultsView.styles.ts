// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { fontSize, fontWeight, lineHeight } from '../../constants/fonts';
import { COLORS_LIGHT } from '../../constants/colors';

const style = StyleSheet.create({
  emptyStateContainer: {
    marginTop: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.huge,
    color: COLORS_LIGHT.G0_black,
  },
});

export default style;
