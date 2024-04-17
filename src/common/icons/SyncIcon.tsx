// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const SyncIcon = ({ width = '12', height = '16', color = COLORS_LIGHT.brightBlue }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 12 16" fill={color}>
    <Path d="M5.81818 2.18182V0L2.90909 2.90909L5.81818 5.81818V3.63636C8.22545 3.63636 10.1818 5.59273 10.1818 8C10.1818 8.73455 10 9.43273 9.67273 10.0364L10.7345 11.0982C11.3018 10.2036 11.6364 9.14182 11.6364 8C11.6364 4.78545 9.03273 2.18182 5.81818 2.18182ZM5.81818 12.3636C3.41091 12.3636 1.45455 10.4073 1.45455 8C1.45455 7.26545 1.63636 6.56727 1.96364 5.96364L0.901818 4.90182C0.334545 5.79636 0 6.85818 0 8C0 11.2145 2.60364 13.8182 5.81818 13.8182V16L8.72727 13.0909L5.81818 10.1818V12.3636Z" />
  </Svg>
);

export { SyncIcon };
