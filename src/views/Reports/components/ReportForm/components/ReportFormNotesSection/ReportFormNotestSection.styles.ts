// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { margin } from '../../../../../../common/constants/dimens';
import { fontSize, fontWeight, lineHeight } from '../../../../../../common/constants/fonts';

const styles = StyleSheet.create({
  notesSectionTitle: {
    lineHeight: lineHeight.standard,
    fontSize: fontSize.standard,
    fontWeight: fontWeight.medium,
    marginLeft: margin.small,
    marginTop: 24,
    marginBottom: 12,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
});

export default styles;
