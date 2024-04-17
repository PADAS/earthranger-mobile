// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';

const styles = StyleSheet.create({
  reportFormSubmitButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    marginTop: 8,
  },
  reportFormSubmitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.02,
    lineHeight: 17,
    color: COLORS_LIGHT.brightBlue,
  },
  formSubmitButtonDisabled: {
    opacity: 0.5,
  },
  extendedSubmitButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
