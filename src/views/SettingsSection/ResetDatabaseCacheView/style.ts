// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { fontSize } from '../../../common/constants/fonts';

export const style = StyleSheet.create({
  containerSafeArea: {
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
    flex: 1,
  },
  infoCardContainer: {
    paddingTop: 16,
    paddingStart: 16,
    paddingEnd: 16,
  },
  infoCardDescriptionContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingStart: 16,
    paddingEnd: 84,
    backgroundColor: COLORS_LIGHT.white,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
  },
  iconContainer: {
    alignSelf: 'center',
  },
  iconBackground: {
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 14,
    marginEnd: 16,
    backgroundColor: COLORS_LIGHT.redLight,
  },
  infoCard: {
    fontSize: 17,
    color: COLORS_LIGHT.G0_black,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_LIGHT.red,
    borderRadius: 5,
  },
  textButton: {
    marginStart: 8,
    fontSize: fontSize.large,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: COLORS_LIGHT.white,
  },
});

export default style;
