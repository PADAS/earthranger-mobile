// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const CoordinatesIcon = ({ width = '24', height = '24', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color}>
    <Path d="M7.5 0C3.354 0 0 3.443 0 7.7 0 13.475 7.5 22 7.5 22S15 13.475 15 7.7C15 3.443 11.646 0 7.5 0Zm0 10.45c-1.479 0-2.679-1.232-2.679-2.75s1.2-2.75 2.679-2.75c1.479 0 2.679 1.232 2.679 2.75s-1.2 2.75-2.679 2.75Z" />
  </Svg>
);

export { CoordinatesIcon };
