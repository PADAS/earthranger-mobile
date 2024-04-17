// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ReportsArrowIcon = ({ width = '15', height = '24', color = COLORS_LIGHT.G2_secondaryMediumGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 15 24" fill={color}>
    <Path d="M0 21.876L2.124 24L14.124 12L2.124 0L0 2.124L9.876 12L0 21.876Z" />
  </Svg>
);

export { ReportsArrowIcon };
