// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ChevronIcon = ({
  width = '10',
  height = '16',
  color = COLORS_LIGHT.G2_secondaryMediumGray,
}: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 10 16" fill={color}>
    <Path d="M2 -6.99382e-07L10 8L2 16L0.88 14.86L7.74 8L0.880001 1.14L2 -6.99382e-07Z" />
  </Svg>
);

export { ChevronIcon };
