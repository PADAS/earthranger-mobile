// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  listRow: {
    borderBottomWidth: 1,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
  },
  listRowText: {
    color: COLORS_LIGHT.G0_black,
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 16,
    marginTop: 20,
    marginRight: 16,
  },
});

export default styles;
