// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { IS_ANDROID } from '../../constants/constants';

const styles = StyleSheet.create({
  backIcon: {
    marginRight: IS_ANDROID ? 16 : 0,
  },
});

export default styles;
