// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const CheckmarkIcon = ({
  width = '24', height = '24', color = COLORS_LIGHT.G0_black, viewbox = '0 0 24 24',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox} fill={color}>
    <Path d="M5.25714 13.4571L0 8.19999L2.28571 6.02856L5.25714 8.99999L13.7143 0.542847L16 2.82856L5.25714 13.4571Z" />
  </Svg>
);

export { CheckmarkIcon };
