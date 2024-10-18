// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../common/constants/colors';
import { shadowStyles } from '../../common/style/shadowStyles';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  addReportButton: {
    position: 'absolute',
    right: 8,
  },
  TrackModeButtonContainer: {
    position: 'absolute',
    right: 8,
  },
  basemapButton: {
    position: 'absolute',
    right: 16,
    width: 36,
    height: 36,
    backgroundColor: COLORS_LIGHT.white,
  },
  basemapIconContainer: {
    width: 32,
    height: 22,
    marginLeft: 12,
    marginTop: 6,
  },
  spinnerContainer: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 100,
  },
  iconContainer: {
    ...shadowStyles.viewDropShadow,
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 48 / 2,
    height: 48,
    justifyContent: 'center',
    marginLeft: 14,
    width: 48,
  },
});

export default styles;
