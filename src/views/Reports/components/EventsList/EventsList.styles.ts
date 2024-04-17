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
  /* Filter Header */
  filterHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterHeaderContent: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterCounter: {
    display: 'flex',
    width: 18,
    height: 18,
    backgroundColor: COLORS_LIGHT.red,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginLeft: 4,
  },
  filterCounterValue: {
    fontSize: 11,
    color: COLORS_LIGHT.white,
  },
  /* End Filter Header */
  searchInput: {
    flex: 1,
    marginStart: IS_IOS ? -10 : 0,
    marginEnd: IS_IOS ? 80 : 40,
    fontSize: 17,
  },
  searchBackIcon: {
    marginRight: IS_IOS ? 0 : 16,
  },
});

export default styles;
