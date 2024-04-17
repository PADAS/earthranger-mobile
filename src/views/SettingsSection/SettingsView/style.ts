import { StyleSheet } from 'react-native';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { fontSize, fontWeight } from '../../../common/constants/fonts';

export const style = StyleSheet.create({
  containerSafeArea: {
    backgroundColor: COLORS_LIGHT.G7_veryLightGrey,
    flex: 1,
  },
  logoContainer: {
    borderTopColor: COLORS_LIGHT.G5_LightGreyLines,
    borderTopWidth: 1,
    paddingBottom: 16,
  },
  labelContainer: {
    borderTopColor: COLORS_LIGHT.G5_LightGreyLines,
    borderTopWidth: 1,
    paddingBottom: 9,
    paddingTop: 16,
    paddingLeft: 18,
    textTransform: 'capitalize',
  },
  menuItemContainer: {
    backgroundColor: COLORS_LIGHT.white,
    borderTopColor: COLORS_LIGHT.G5_LightGreyLines,
    borderTopWidth: 1,
  },
  menuSubItemContainer: {
    backgroundColor: COLORS_LIGHT.white,
  },
  subSettingContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  logo: {
    width: 150,
    height: 30,
    marginTop: 24,
    marginStart: 16,
    resizeMode: 'contain',
  },
  textVersion: {
    color: COLORS_LIGHT.G0_black,
    marginTop: 23,
    marginStart: 16,
  },
  textDeveloped: {
    color: COLORS_LIGHT.G0_black,
    marginTop: 10,
    marginStart: 16,
    marginBottom: 22,
    marginRight: 22,
  },
  textTheMara: {
    color: COLORS_LIGHT.brightBlue,
    marginBottom: 22,
  },
  line: {
    borderBottomColor: COLORS_LIGHT.G5_LightGreyLines,
    borderBottomWidth: 1,
  },
  textIcon: {
    color: COLORS_LIGHT.G0_black,
    marginStart: 20,
    fontSize: fontSize.huge,
    fontWeight: fontWeight.semiBold,
    width: '80%',
  },
  textIconSecondary: {
    marginStart: 20,
    width: '80%',
  },
  // Setting Container
  settingContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  // Setting Icon
  settingIcon: {
    width: 17.6,
    height: 22,
    resizeMode: 'contain',
    paddingTop: 3,
  },
  // Setting Text
  settingTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  // Setting Username/Switch Button
  switchUserContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingStart: 16,
    paddingEnd: 16,
    paddingTop: 18,
    paddingBottom: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS_LIGHT.white,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchUserIcon: {
    resizeMode: 'contain',
    width: 28,
    height: 18,
  },
  textUsername: {
    color: COLORS_LIGHT.G0_black,
    fontSize: fontSize.huge,
    fontWeight: fontWeight.semiBold,
    marginLeft: 20,
    marginRight: 20,
  },
  switchUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS_LIGHT.G6_LightGreyButton,
    paddingStart: 16,
    paddingEnd: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 8,
  },
  // Setting Name
  textSettingName: {
    color: COLORS_LIGHT.G0_black,
    fontSize: fontSize.huge,
    fontWeight: fontWeight.semiBold,
    paddingRight: 5,
  },
  // Setting Description
  textSettingDescription: {
    marginStart: 2,
    fontSize: fontSize.standard,
    fontWeight: fontWeight.normal,
    color: COLORS_LIGHT.G2_secondaryMediumGray,
  },
  // Setting Switch
  switchSetting: {
    justifyContent: 'flex-end',
  },
  textSiteName: {
    color: COLORS_LIGHT.G0_black,
    marginStart: 16,
    marginBottom: 16,
    fontSize: fontSize.large,
  },
  textBold: {
    color: COLORS_LIGHT.G0_black,
    marginStart: 22,
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
  },
});

export default style;
