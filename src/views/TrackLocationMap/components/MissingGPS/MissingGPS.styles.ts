// External Dependencies
import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

// Internal Dependencies
import { shadowStyles } from '../../../../common/style/shadowStyles';
import { IS_ANDROID } from '../../../../common/constants/constants';

// Constants
const SAFE_AREA_INSETS_BOTTOM = IS_ANDROID ? 25 : 24;

const styles = StyleSheet.create({
  mainContainer: {
    bottom: 14 + SAFE_AREA_INSETS_BOTTOM,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 14,
    paddingRight: 8,
    position: 'absolute',
    width: '100%',
    justifyContent: 'space-between',
  },
  messageContainer: {
    ...shadowStyles.viewDropShadow,
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 5,
    justifyContent: 'center',
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 14,
    paddingTop: 8,
    shadowColor: COLORS_LIGHT.G0_black,
    width: '80%',
  },
  gpsText: {
    color: COLORS_LIGHT.G0_black,
    fontSize: 18,
  },
  iconContainer: {
    ...shadowStyles.viewDropShadow,
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 48 / 2,
    height: 48,
    justifyContent: 'center',
    marginLeft: 14,
    opacity: 0.8,
    width: 48,
  },
  noGPSIcon: {
    height: 18,
    width: 18,
  },
});

export default styles;
