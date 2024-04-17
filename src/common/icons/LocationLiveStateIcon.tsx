// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LocationLiveStateIcon = ({
  width = '12',
  height = '12',
  color = COLORS_LIGHT.brightBlue,
  viewbox = '0 0 12 12',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox} fill={color}>
    <Path d="M9.675 3.02C9.335 1.295 7.82 0 6 0C4.555 0 3.3 0.82 2.675 2.02C1.17 2.18 0 3.455 0 5C0 6.655 1.345 8 3 8H9.5C10.88 8 12 6.88 12 5.5C12 4.18 10.975 3.11 9.675 3.02Z" />
  </Svg>
);

export { LocationLiveStateIcon };
