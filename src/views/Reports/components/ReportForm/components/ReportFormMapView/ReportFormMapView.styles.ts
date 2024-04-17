// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  mapContainer: {
    height: 124,
  },
  mapImage: {
    flex: 1,
    height: 124,
  },
  mapCoordinatesContainer: {
    position: 'absolute',
    left: 8,
    bottom: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4,
    paddingLeft: 8,
    borderRadius: 20,
  },
  mapCoordinates: {
    color: COLORS_LIGHT.white,
  },
  editIcon: {
    position: 'absolute',
    top: 12,
    right: 19,
  },
  touchableArea: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'flex-end',
  },
});

export default styles;
