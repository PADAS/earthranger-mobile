// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { margin } from '../../../../../../common/constants/dimens';
import { fontSize, fontWeight, lineHeight } from '../../../../../../common/constants/fonts';

const styles = StyleSheet.create({
  imagesSectionTitle: {
    marginTop: 24,
    marginBottom: 9,
    marginStart: margin.small,
    lineHeight: lineHeight.standard,
    fontSize: fontSize.standard,
    fontWeight: fontWeight.medium,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginStart: margin.small,
    marginEnd: margin.small,
  },
  imageItem: {
    width: '33%',
    height: 120,
    resizeMode: 'cover',
    marginEnd: 1,
    marginBottom: 1,
  },
  addImagePlaceholderContainer: {
    height: 120,
    width: '33%',
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 3,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default styles;
