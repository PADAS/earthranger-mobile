// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { IS_IOS } from '../../../../common/constants/constants';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  flatList: {
    zIndex: 0,
  },
  columnWrapperStyle: {
    flex: 1,
    alignItems: 'stretch',
  },
  searchInput: {
    flex: 1,
    marginStart: IS_IOS ? 10 : 0,
    marginEnd: IS_IOS ? 80 : 40,
    fontSize: 17,
  },
  searchBackIcon: {
    marginRight: IS_IOS ? 0 : 16,
  },
});

export default styles;
