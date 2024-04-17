// External Dependencies
import { Dimensions, StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { IS_ANDROID, IS_IOS } from '../../../../common/constants/constants';
import { shadowStyles } from '../../../../common/style/shadowStyles';
import { getTopAreaInsets } from '../../../../common/utils/safeAreaInsets';

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  coordinatesContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    position: 'absolute',
    top: 32,
    zIndex: 11,
    flexDirection: 'row',
  },
  coordinatesPressable: {
    flexDirection: 'row',
  },
  mapCoordinates: {
    color: COLORS_LIGHT.white,
  },
  editIconContainer: {
    marginLeft: 4,
    justifyContent: 'center',
  },
  locationIconContainer: {
    ...shadowStyles.viewDropShadow,
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 24,
    bottom: (IS_ANDROID ? 25 : getTopAreaInsets() + 16) + 16,
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    width: 48,
    zIndex: 10,
  },
  targetIcon: {
    position: 'absolute',
    width: 44,
    left: (Dimensions.get('window').width / 2) - 22,
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backbutton: {
    marginRight: IS_ANDROID ? 16 : 0,
    marginLeft: IS_IOS ? -16 : 0,
  },
});

export default styles;
