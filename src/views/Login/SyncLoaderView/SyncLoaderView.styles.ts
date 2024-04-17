// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../common/constants/colors';

const style = StyleSheet.create({
  loadingViewBackground: {
    flex: 1,
  },
  loadingViewItem: {
    alignItems: 'center',
    display: 'flex',
    position: 'absolute',
    width: '100%',
    zIndex: 100,
  },
  loadingViewLogo: {
    top: 139,
  },
  loadingViewText: {
    top: 270,
  },
  loadingViewStepText: {
    color: COLORS_LIGHT.white,
    fontSize: 15,
    fontWeight: '400',
  },
  loadingViewLoaderContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    height: 8,
    top: 320,
    width: 100,
  },
  loadingViewImage: {
    flex: 1,
  },
});

export default style;
