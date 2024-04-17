// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../common/constants/colors';
import { fontSize, fontWeight, lineHeight } from '../../../../../common/constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: COLORS_LIGHT.white,
  },
  titleText: {
    marginLeft: 12,
    width: '54%',
    lineHeight: lineHeight.large,
    fontSize: fontSize.large,
    fontWeight: fontWeight.medium,
    textAlignVertical: 'center',
  },
  dateText: {
    marginLeft: 'auto',
    lineHeight: lineHeight.medium,
    fontSize: fontSize.medium,
    fontWeight: fontWeight.normal,
  },
  divider: {
    margingTop: 10,
    height: 1,
    backgroundColor: COLORS_LIGHT.G5_LightGreyLines,
  },
});

export default styles;
