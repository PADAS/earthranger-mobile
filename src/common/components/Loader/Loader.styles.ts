import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: COLORS_LIGHT.blackTransparent88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorContainer: {
    height: 80,
    width: 80,
    borderRadius: 15,
    backgroundColor: COLORS_LIGHT.G6_LightGreyButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    flex: 1,
  },
});

export default styles;
