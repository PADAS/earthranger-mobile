// External Dependencies
import React from 'react';
import {
  Svg,
  Circle,
  Rect,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const StopIcon = ({ width = '15', height = '16', color = COLORS_LIGHT.red }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 15 16">
    <Circle cx="7.5" cy="8" r="7" stroke={color} />
    <Rect x="5" y="5.5" width="5" height="5" fill={color} />
  </Svg>
);

export { StopIcon };
