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
    paddingTop: 16,
  },
  optionItemContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingStart: 16,
    paddingEnd: 16,
    backgroundColor: COLORS_LIGHT.white,
  },
  line: {
    marginStart: 16,
    marginEnd: 16,
    marginTop: 1,
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
  textSubtitle: {
    color: COLORS_LIGHT.G2_5_mobileSecondaryGray,
    fontSize: fontSize.medium,
  },
});

export default style;
