// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LocationOnStateIcon = ({
  width = '12',
  height = '12',
  color = COLORS_LIGHT.brightBlue,
  viewbox = '0 0 12 12',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox} fill={color}>
    <Path d="M9.675 3.02C9.335 1.295 7.82 0 6 0C5.26 0 4.575 0.215 3.995 0.585L4.725 1.315C5.105 1.115 5.54 1 6 1C7.52 1 8.75 2.23 8.75 3.75V4H9.5C10.33 4 11 4.67 11 5.5C11 6.065 10.68 6.555 10.22 6.81L10.945 7.535C11.58 7.08 12 6.34 12 5.5C12 4.18 10.975 3.11 9.675 3.02ZM1.5 0.635L2.875 2.005C1.28 2.075 0 3.385 0 5C0 6.655 1.345 8 3 8H8.865L9.865 9L10.5 8.365L2.135 0L1.5 0.635ZM3.865 3L7.865 7H3C1.895 7 1 6.105 1 5C1 3.895 1.895 3 3 3H3.865Z" />
  </Svg>
);

export { LocationOnStateIcon };
