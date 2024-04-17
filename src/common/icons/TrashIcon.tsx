// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';
import { COLORS_LIGHT } from '../constants/colors';

const TrashIcon = ({
  width = '20',
  height = '20',
  color = COLORS_LIGHT.white,
  viewbox = '0 0 13 17',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox}>
    <Path fill={color} d="M.889 14.646c0 .973.8 1.77 1.778 1.77h7.11c.979 0 1.779-.797 1.779-1.77V4.029H.889v10.617zM12.445 1.375H9.332L8.444.49H4l-.889.885H0v1.77h12.444v-1.77z" />
  </Svg>
);

export { TrashIcon };
