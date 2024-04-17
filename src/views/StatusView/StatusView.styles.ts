import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../common/constants/colors';
import { fontSize, fontWeight } from '../../common/constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
  },
  scrollContainer: {
    marginTop: 24,
  },
  infoCardInfoIcon: {
    alignItems: 'flex-end',
    paddingTop: 23,
    paddingRight: 16,
  },
  syncButtonDisabled: {
    opacity: 0.2,
    backgroundColor: COLORS_LIGHT.white,
  },
  syncTextButton: {
    marginLeft: 5,
    fontSize: fontSize.large,
    fontWeight: fontWeight.bold,
    color: COLORS_LIGHT.brightBlue,
  },
});

export default styles;
