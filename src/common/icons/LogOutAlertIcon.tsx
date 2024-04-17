// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LogOutAlertIcon = ({ width = '20', height = '20', color = COLORS_LIGHT.red }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill={color}>
    <Path d="M0 18.478H20.8421L10.4211 0.478027L0 18.478ZM11.3684 15.6359H9.47368V13.7412H11.3684V15.6359ZM11.3684 11.8464H9.47368V8.05697H11.3684V11.8464Z" />
  </Svg>
);

export { LogOutAlertIcon };
