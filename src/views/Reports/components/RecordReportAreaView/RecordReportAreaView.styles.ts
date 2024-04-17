// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { getTopAreaInsets } from '../../../../common/utils/safeAreaInsets';

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  buttonOuterContainer: {
    bottom: getTopAreaInsets() + 90,
    position: 'absolute',
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  buttonInnerContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonBase: {
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
  },
  buttonsSpacer: {
    justifyContent: 'center',
  },
  disabledState: {
    opacity: 0.75,
  },
});

export default styles;
