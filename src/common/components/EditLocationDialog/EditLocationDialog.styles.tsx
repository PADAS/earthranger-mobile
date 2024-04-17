// External Dependencies
import { StyleSheet } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../constants/colors';

const styles = StyleSheet.create({
  /* Modal */
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_LIGHT.blackTransparent88,
  },
  modalContainer: {
    width: '95%',
    backgroundColor: COLORS_LIGHT.white,
    borderRadius: 5,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
  },
  /* End Modal */

  /* Text Inputs */
  modalTextInputContainer: {
    marginTop: 24,
  },
  modalTextInput: {
    marginTop: 4,
  },
  modalInputContainer: {
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
  },
  modalInputContainerError: {
    backgroundColor: 'rgba(208, 3, 27, 0.03)',
  },
  modalErrorText: {
    color: COLORS_LIGHT.red,
    marginLeft: 16,
    marginRight: 16,
  },
  /* End Text Inputs */

  /* Buttons */
  modalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  cancelButton: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
  },
  cancelButtonText: {
    color: COLORS_LIGHT.G2_secondaryMediumGray,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.brightBlue,
    borderRadius: 5,
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: COLORS_LIGHT.white,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.02,
  },
  /* End Buttons */
});

export default styles;
