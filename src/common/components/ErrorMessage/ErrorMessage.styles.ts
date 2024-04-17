// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';

const style = StyleSheet.create({
  errorMessage: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  errorMessageContainer: {
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.G0_black,
    opacity: 0.9,
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 14,
  },
  errorMessageText: {
    color: COLORS_LIGHT.white,
    maxWidth: '90%',
  },
  errorMessageIcon: {
    marginLeft: 16,
  },
});

export default style;
