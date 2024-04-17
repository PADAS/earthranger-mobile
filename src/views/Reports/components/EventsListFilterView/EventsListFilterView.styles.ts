// External Dependencies
import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

// Internal Dependencies

const styles = StyleSheet.create({
  /* General */
  sectionTitle: {
    margin: 16,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  /* End General */

  /* Status Section */
  statusSectionContainer: {
    backgroundColor: COLORS_LIGHT.white,
  },
  /* End Status Section */

  /* Checkbox Options */
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 14,
  },
  checkboxLabel: {
    color: COLORS_LIGHT.G0_black,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  /* End Checkbox Options */

  /* Footer */
  footer: {
    backgroundColor: COLORS_LIGHT.white,
    bottom: 0,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'flex-end',
    paddingVertical: 12,
    position: 'absolute',
    width: '100%',
  },
  footerButton: {
    backgroundColor: COLORS_LIGHT.G6_LightGreyButton,
    borderRadius: 5,
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  footerButtonDisabled: {
    opacity: 0.8,
  },
  footerButtonLabel: {
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  footerButtonIcon: {
    marginRight: 8,
  },
  footerButtonConfirm: {
    backgroundColor: COLORS_LIGHT.brightBlue,
  },
  /* End Footer */
});

export default styles;
