import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../common/constants/colors';

const style = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  container: {
    flex: 1,
    marginStart: 18,
    marginEnd: 18,
    justifyContent: 'flex-end',
  },
  logo: {
    width: 180,
    height: 85,
    marginTop: 21,
    marginBottom: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  /* Loading View */
  loadingViewBackground: {
    display: 'flex',
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
    display: 'flex',
    flex: 1,
    width: '100%',
  },
  /* End Loading View */
});

export default style;
