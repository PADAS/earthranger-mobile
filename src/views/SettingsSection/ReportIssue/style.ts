import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { shadowStyles } from '../../../common/style/shadowStyles';
import { margin } from '../../../common/constants/dimens';
import { fontSize, fontWeight, lineHeight } from '../../../common/constants/fonts';
import { getTopAreaInsets } from '../../../common/utils/safeAreaInsets';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_LIGHT.white,
  },
  appbar: {
    backgroundColor: COLORS_LIGHT.white,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS_LIGHT.white,
  },
  shareLogsContainer: {
    marginTop: 26,
    marginLeft: margin.standard,
    marginRight: margin.standard,
    flexDirection: 'row',
  },
  titleAppBar: {
    fontSize: fontSize.large,
    lineHeight: 19,
    fontWeight: fontWeight.normal,
    color: COLORS_LIGHT.G0_black,
  },
  titleText: {
    marginLeft: margin.standard,
    marginRight: margin.standard,
    marginTop: 21,
    fontSize: fontSize.huge,
    lineHeight: lineHeight.huge,
    fontWeight: fontWeight.bold,
    color: COLORS_LIGHT.G0_black,
  },
  bodyText: {
    marginLeft: margin.standard,
    marginRight: margin.standard,
    marginTop: 8,
    fontSize: fontSize.large,
    lineHeight: lineHeight.standard,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  messageText: {
    marginLeft: margin.standard,
    marginTop: 32,
    fontSize: fontSize.standard,
    lineHeight: lineHeight.medium,
    fontWeight: fontWeight.medium,
    color: COLORS_LIGHT.G3_secondaryMediumLightGray,
    textTransform: 'uppercase',
  },
  textInput: {
    marginLeft: margin.standard,
    marginRight: margin.standard,
    marginTop: 4,
    fontSize: fontSize.large,
    lineHeight: 19,
    color: COLORS_LIGHT.G0_black,
    height: 72,
    borderColor: COLORS_LIGHT.G5_LightGreyLines,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
    paddingLeft: 8,
    paddingTop: 8,
    paddingRight: 8,
  },
  checkBox: {
    color: COLORS_LIGHT.G0_black,
    height: 16,
    marginTop: 1,
  },
  checkBoxTextTitle: {
    marginLeft: 12,
    fontSize: fontSize.huge,
    lineHeight: lineHeight.huge,
    fontWeight: fontWeight.medium,
    color: COLORS_LIGHT.G0_black,
    marginRight: 12,
  },
  checkBoxTextBody: {
    marginLeft: 60,
    marginRight: margin.standard,
    marginTop: 8,
    fontSize: fontSize.large,
    lineHeight: lineHeight.standard,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  reportIssueButton: {
    ...shadowStyles.viewDropShadow,
    width: 324,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_LIGHT.brightBlue,
    marginStart: 18,
    marginEnd: 18,
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 5,
    bottom: getTopAreaInsets() + 14,
  },
  reportIssueButtonDisabled: {
    opacity: 0.5,
  },
  reportIssueButtonText: {
    fontSize: fontSize.large,
    lineHeight: lineHeight.large,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.25,
    color: COLORS_LIGHT.white,
    textTransform: 'uppercase',
  },
  sendIssueButton: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default styles;
