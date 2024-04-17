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
  overallContainer: {
    paddingStart: 16,
    paddingEnd: 16,
    paddingTop: 28,
  },
  line: {
    marginTop: 16,
    marginBottom: 16,
    borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
    borderBottomWidth: 1,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  textContainer: {
    flex: 4,
    marginStart: 16,
    alignSelf: 'center',
  },
  textSelected: {
    color: COLORS_LIGHT.G0_black,
    fontSize: fontSize.larger,
  },
  textDeselected: {
    color: COLORS_LIGHT.G2_5_mobileSecondaryGray,
    fontSize: fontSize.larger,
  },
});

export default style;
