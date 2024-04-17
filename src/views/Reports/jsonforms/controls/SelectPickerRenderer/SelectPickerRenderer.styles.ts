// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../common/constants/colors';

const styles = StyleSheet.create({
  textInputContainer: {
    height: 60,
  },
  textInputContainerWithValue: {
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    height: 64,
  },
});

export default styles;
