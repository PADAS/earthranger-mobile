// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const DarkModeIcon = ({ width = '24', height = '24', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color}>
    <Path d="M8 16c-2.222 0-4.111-.778-5.667-2.333C.778 12.11 0 10.222 0 8s.778-4.111 2.333-5.667C3.89.778 5.778 0 8 0c.119 0 .244.004.378.011l.51.033A4.855 4.855 0 0 0 7.645 1.8 5.561 5.561 0 0 0 7.2 4c0 1.333.467 2.467 1.4 3.4.933.933 2.067 1.4 3.4 1.4.77 0 1.504-.137 2.2-.411a4.913 4.913 0 0 0 1.756-1.145c.014.178.026.323.033.434.007.11.011.218.011.322 0 2.222-.778 4.111-2.333 5.667C12.11 15.222 10.222 16 8 16Z" />
  </Svg>
);

export { DarkModeIcon };
