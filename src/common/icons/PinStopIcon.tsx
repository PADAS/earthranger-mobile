// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const PinStopIcon = ({ width = '11', height = '16', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 11 16">
    <Path fill={color} fillRule="evenodd" d="M2.788.723A5.518 5.518 0 0 1 10.36 8.16c-.013.06-4.317 7.536-4.317 7.536a.607.607 0 0 1-1.052 0S.687 8.22.673 8.16A5.518 5.518 0 0 1 2.788.723Zm4.62 3.425H3.851v3.556h3.555V4.149Z" clipRule="evenodd" />
  </Svg>
);

export { PinStopIcon };
