import { StyleProp, TextStyle } from 'react-native';
import { COLORS_LIGHT } from '../../common/constants/colors';

export const screenOptions = () => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: COLORS_LIGHT.white,
  },
  tabBarActiveTintColor: COLORS_LIGHT.G1_off_black,
  tabBarInactiveTintColor: COLORS_LIGHT.G1_off_black,
  tabBarActiveBackgroundColor: COLORS_LIGHT.blueLight,
  tabBarInactiveBackgroundColor: COLORS_LIGHT.white,
  tabBarHideOnKeyboard: true,
});

export const tabBarItemStyle = {
  borderRadius: 40,
  marginHorizontal: 8,
  marginVertical: 4,
  paddingTop: 4,
};

export const tabBarLabelStyle: StyleProp<TextStyle> = {
  fontSize: 10,
  fontStyle: 'normal',
  fontWeight: '700',
  paddingBottom: 4,
  textTransform: 'uppercase',
};

export const tabBarOptions = () => ({
  activeTintColor: COLORS_LIGHT.white,
  inactiveTintColor: COLORS_LIGHT.G4_secondaryLightGray,
  activeBackgroundColor: COLORS_LIGHT.G0_black,
  inactiveBackgroundColor: COLORS_LIGHT.G0_black,
});
