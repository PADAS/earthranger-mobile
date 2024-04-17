// External Dependencies
import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { fontSize, fontWeight } from '../../../common/constants/fonts';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS_LIGHT.white,
  },
  logo: {
    width: 200,
    height: 94,
    resizeMode: 'contain',
  },
  tagLine: {
    fontWeight: fontWeight.normal,
    fontSize: 21,
    color: COLORS_LIGHT.G0_black,
    marginBottom: 32,
    marginLeft: 24,
    marginRight: 24,
  },
  pin: {
    marginBottom: 88,
    borderColor: COLORS_LIGHT.G2_5_mobileSecondaryGray,
    borderWidth: 2,
  },
  pinActive: {
    backgroundColor: COLORS_LIGHT.brightBlue,
    borderColor: COLORS_LIGHT.brightBlue,
    borderWidth: 8,
  },
  error: {
    backgroundColor: COLORS_LIGHT.red,
  },
  errorText: {
    fontWeight: fontWeight.normal,
    fontSize: fontSize.larger,
  },
});

export default styles;
