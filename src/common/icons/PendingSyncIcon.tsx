// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const PendingSyncIcon = ({ width = '32', height = '33', color = COLORS_LIGHT.brightBlue }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 32 33" fill={color}>
    <Path d="M32 0.852051L0 14.2387V15.9809L12.16 20.6921L16.8533 32.8521H18.5956L32 0.852051Z" />
  </Svg>
);

export { PendingSyncIcon };
