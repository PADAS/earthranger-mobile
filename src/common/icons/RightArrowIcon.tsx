// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const RightArrowIcon = ({ width = '16', height = '16', color = COLORS_LIGHT.G3_secondaryMediumLightGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill={color}>
    <Path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" />
  </Svg>
);

export { RightArrowIcon };
