// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const CloseIcon = ({
  width = '16',
  height = '16',
  color = COLORS_LIGHT.G2_secondaryMediumGray,
  viewbox = '0 0 16 16',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox}>
    <Path d="M16 1.61143L14.3886 0L8 6.38857L1.61143 0L0 1.61143L6.38857 8L0 14.3886L1.61143 16L8 9.61143L14.3886 16L16 14.3886L9.61143 8L16 1.61143Z" fill={color} />
  </Svg>
);

export { CloseIcon };
