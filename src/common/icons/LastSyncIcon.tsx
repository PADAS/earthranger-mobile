// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LastSyncIcon = ({ width = '32', height = '22', color = COLORS_LIGHT.darkTeal }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 32 22" fill={color}>
    <Path d="M25.8 8.05333C24.8933 3.45333 20.8533 0 16 0C12.1467 0 8.8 2.18667 7.13333 5.38667C3.12 5.81333 0 9.21333 0 13.3333C0 17.7467 3.58667 21.3333 8 21.3333H25.3333C29.0133 21.3333 32 18.3467 32 14.6667C32 11.1467 29.2667 8.29333 25.8 8.05333ZM18.6667 12V17.3333H13.3333V12H9.33333L16 5.33333L22.6667 12H18.6667Z" />
  </Svg>
);

export { LastSyncIcon };
