import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

const style = StyleSheet.create({
  // General Styles
  icon: {
    resizeMode: 'contain',
    position: 'absolute',
  },
  text: {
    color: COLORS_LIGHT.G3_secondaryMediumLightGray,
    marginTop: 22,
    fontSize: 12,
    fontWeight: '500',
  },
  textInput: {
    width: '100%',
    height: 40,
    marginTop: 5,
    paddingStart: 8,
    borderWidth: 0.5,
    borderRadius: 3,
    borderColor: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  textInputError: {
    borderColor: COLORS_LIGHT.red,
  },
  row: {
    flexDirection: 'row',
  },
  // Specific Overrides
  textInputSiteName: {
    flex: 1,
    paddingStart: 8,
    marginEnd: 3,
  },
  textInputWithIcon: {
    paddingStart: 8,
    paddingEnd: 55,
  },
  textSiteName: {
    flex: 0,
    marginTop: 12,
    fontSize: 16,
  },
  textInputErrorText: {
    color: COLORS_LIGHT.red,
    width: '100%',
    fontSize: 12,
    lineHeight: 14,
    marginTop: 6,
  },
  errorText: {
    color: COLORS_LIGHT.red,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 16,
    marginTop: 35,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 34,
    marginTop: '16%',
  },
  button: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_LIGHT.brightBlue,
    borderRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: COLORS_LIGHT.white,
  },
  passwordIcon: {
    width: 22,
    height: 15,
    top: 17,
    right: 10,
  },
  checkboxContainer: {
    marginTop: 23,
  },
  checkboxAndroid: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
    marginStart: -7,
  },
  checkboxiOS: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS_LIGHT.G0_black,
    marginStart: 14,
  },
});

export default style;
