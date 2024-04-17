// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const EventRightArrow = ({ width = '10', height = '16', color = COLORS_LIGHT.G2_secondaryMediumGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 10 16" fill={color}>
    <Path d="M1.88 0 0 1.88 6.107 8 0 14.12 1.88 16l8-8-8-8Z" />
  </Svg>
);

export { EventRightArrow };
