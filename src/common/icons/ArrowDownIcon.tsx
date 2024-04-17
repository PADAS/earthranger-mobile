// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ArrowDownIcon = ({ width = '8', height = '4', color = COLORS_LIGHT.G3_secondaryMediumLightGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 8 4" fill={color}>
    <Path d="M0 0L4 4L8 0L0 0Z" />
  </Svg>
);

export { ArrowDownIcon };
