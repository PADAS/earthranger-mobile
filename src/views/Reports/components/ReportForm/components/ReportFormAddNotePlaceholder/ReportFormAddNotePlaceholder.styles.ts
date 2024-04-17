// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { margin } from '../../../../../../common/constants/dimens';
import { fontWeight } from '../../../../../../common/constants/fonts';

const styles = StyleSheet.create({
  noteButton: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderLeftWidth: 1,
    borderRadius: 3,
    borderRightWidth: 1,
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: margin.small,
    marginRight: margin.small,
    paddingBottom: 16,
    paddingTop: 16,
  },
  textNoteButton: {
    fontSize: 15,
    fontWeight: fontWeight.normal,
    marginLeft: 8,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
});

export default styles;
