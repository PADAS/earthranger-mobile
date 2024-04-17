// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { IS_ANDROID, IS_IOS } from '../../constants/constants';

const styles = StyleSheet.create({
  backbutton: {
    marginRight: IS_ANDROID ? 16 : 0,
    marginLeft: IS_IOS ? -16 : 0,
  },
  closebutton: {
    marginRight: IS_ANDROID ? 16 : 0,
  },
});

export default styles;
