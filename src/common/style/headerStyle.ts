// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { IS_ANDROID } from '../constants/constants';
import { COLORS_LIGHT } from '../constants/colors';

const styles = StyleSheet.create({
  headerStyle: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: IS_ANDROID ? 1.8 : 0.3,
    shadowRadius: IS_ANDROID ? 10 : 4,
    elevation: 10,
  },
  titleStyle: {
    marginLeft: 8,
    color: COLORS_LIGHT.G0_black,
  },
  backIconAndroid: {
    marginRight: 16,
  },
});

export { styles };
