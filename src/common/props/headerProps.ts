import { COLORS_LIGHT } from '../constants/colors';
import { styles } from '../style/headerStyle';
import {
  fontSize,
  fontWeight,
  lineHeight,
} from '../constants/fonts';

const hiddenHeaderOption = {
  headerShown: false,
};

const navigationOptionsHeader = () => ({
  headerTintColor: COLORS_LIGHT.G0_black,
  headerBackTitleStyle: styles.titleStyle,
  headerBackTitleVisible: false,
  headerStyle: styles.headerStyle,
  headerTitleAlign: 'left',
});

const headerBigText = () => ({
  headerStyle: {
    shadowColor: 'transparent',
  },
  headerTitleStyle: {
    lineHeight: lineHeight.massive,
    fontSize: fontSize.massive,
    fontWeight: fontWeight.medium,
  },
  headerShown: true,
});

export { hiddenHeaderOption, navigationOptionsHeader, headerBigText };
