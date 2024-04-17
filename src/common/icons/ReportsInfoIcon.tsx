// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ReportsInfoIcon = ({ width = '16', height = '16', color = COLORS_LIGHT.G2_secondaryMediumGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill={color}>
    <Path d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8.8 12H7.2V7.2H8.8V12ZM8.8 5.6H7.2V4H8.8V5.6Z" />
  </Svg>
);

export { ReportsInfoIcon };
