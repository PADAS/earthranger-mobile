// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';
import { COLORS_LIGHT } from '../constants/colors';

const LocationOffForIosOffline = ({ width = '18', height = '18', color = COLORS_LIGHT.G4_secondaryLightGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill={color}>
    <Path d="M0 0L20 8.36667V9.45556L12.4 12.4L9.46667 20H8.37778L0 0Z" />
  </Svg>
);

export { LocationOffForIosOffline };
