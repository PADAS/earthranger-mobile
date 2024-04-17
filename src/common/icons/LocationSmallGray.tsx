// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LocationSmallGray = ({ width = '8', height = '8', color = COLORS_LIGHT.G3_secondaryMediumLightGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 8 8" fill={color}>
    <Path d="M8 0L0 3.34667V3.78222L3.04 4.96L4.21333 8H4.64889L8 0Z" />
  </Svg>
);

export { LocationSmallGray };
