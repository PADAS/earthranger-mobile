// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../common/constants/colors';

const styles = StyleSheet.create({
  // General Styles
  container: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
  },
  addReportButton: {
    position: 'absolute',
    bottom: 22,
    right: 8,
  },
  spinnerContainer: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  infoCardInfoIcon: {
    alignItems: 'flex-end',
    paddingTop: 23,
    paddingRight: 16,
  },
});

export default styles;
