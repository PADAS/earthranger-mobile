import { Colors, Typography } from 'react-native-ui-lib';

export const loadReactNativeUILibraryConfiguration = () => {
  Colors.loadColors({
    black: '#000000',
    blackOpacity75: 'rgba(0, 0, 0, 0.75)',
    blackOpacity88: 'rgba(0, 0, 0, 0.88)',
    brightBlue: '#0056C7',
    brightRed: '#D0031B',
    lightGrayLines: '#DDDDDD',
    secondaryGray: '#767676',
    secondaryMediumGray: '#63666A',
    secondaryMobileGray: '#767676',
    white: '#FFFFFF',
    whiteOpacity75: 'rgba(255, 255, 255, 0.75)',
  });

  Typography.loadTypographies({
    heading1: {
      fontSize: 25,
      fontWeight: '600',
    },
    heading2: {
      fontSize: 21,
      fontWeight: '400',
    },
    heading3: {
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    bodySmall: {
      fontSize: 15,
      fontWeight: '400',
    },
    label: {
      fontSize: 13,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 0.26,
    },
    centeredText: {
      textAlign: 'center',
    },
    mobileBody: {
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
    },
  });
};
