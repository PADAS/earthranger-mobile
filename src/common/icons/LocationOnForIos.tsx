// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LocationOnForIos = ({ width = '18', height = '18', color = COLORS_LIGHT.brightBlue }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill={color}>
    <Path d="M18 0L0 7.53V8.51L6.84 11.16L9.48 18H10.46L18 0Z" />
  </Svg>
);

export { LocationOnForIos };
