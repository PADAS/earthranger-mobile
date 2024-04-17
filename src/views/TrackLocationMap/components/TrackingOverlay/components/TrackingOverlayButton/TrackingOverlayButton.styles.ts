// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { fontSize, fontWeight, lineHeight } from '../../../../../../common/constants/fonts';
import { shadowStyles } from '../../../../../../common/style/shadowStyles';

const styles = StyleSheet.create({
  trackOverlayButton: {
    ...shadowStyles.viewDropShadow,
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
    left: 14,
    paddingHorizontal: 9,
    paddingVertical: 9,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusIndicator: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusIconContainer: {
    paddingTop: 4,
  },
  statusImage: {
    height: 12,
    resizeMode: 'contain',
    width: 12,
  },
  buttonTextContainer: {
    color: COLORS_LIGHT.G0_black,
    fontSize: fontSize.medium,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.medium,
    marginLeft: 4,
  },
});

export default styles;
