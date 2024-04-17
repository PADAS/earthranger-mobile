// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS_LIGHT.white,
    flex: 1,
  },
  listItem: {
    borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
    borderBottomWidth: 1,
    padding: 16,
    flexDirection: 'row',
  },
  detailsContainer: {
    width: '95%',
  },
  rightArrowContainer: {
    width: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default style;
