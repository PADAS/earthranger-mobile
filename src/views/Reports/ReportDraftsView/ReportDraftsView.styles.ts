// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { IS_ANDROID } from '../../../common/constants/constants';
import { fontSize, fontWeight, lineHeight } from '../../../common/constants/fonts';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  flatList: {
    marginBottom: IS_ANDROID ? 45 : 30,
    backgroundColor: COLORS_LIGHT.white,
  },
  appbar: {
    backgroundColor: COLORS_LIGHT.white,
  },
  titleAppBar: {
    fontSize: fontSize.large,
    lineHeight: lineHeight.large,
    fontWeight: fontWeight.normal,
    color: COLORS_LIGHT.G0_black,
  },
  dateHeaderText: {
    marginLeft: 'auto',
    marginRight: 16,
    marginTop: IS_ANDROID ? 16 : 0,
    fontSize: fontSize.medium,
    lineHeight: lineHeight.medium,
    fontWeight: fontWeight.normal,
    color: COLORS_LIGHT.G0_black,
  },
  divider: {
    height: 1,
    marginTop: 13,
    backgroundColor: COLORS_LIGHT.G5_LightGreyLines,
  },
});

export default styles;
