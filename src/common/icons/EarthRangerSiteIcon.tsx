// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const EarthRangerSiteIcon = ({
  width = '46',
  height = '46',
  color = COLORS_LIGHT.G2_5_mobileSecondaryGray,
  viewbox = '0 0 22 22',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox} fill={color}>
    <Path d="M8.4634 7.70874V7.93346C8.4634 8.68506 8.32335 9.53539 7.28322 10.1465L4.33178 12.0001L1.26637 10.1469C0.197749 9.48121 0.197754 8.35762 0.197754 7.93466V7.71797L8.4634 7.70874Z" />
    <Path d="M4.33026 0L0 0.710273L0.197432 3.19703H8.46308L8.66052 0.710273L4.33026 0Z" />
    <Path d="M7.47665 3.85986L0.197754 3.86749V6.94654H7.47665V3.85986Z" />
  </Svg>
);

export { EarthRangerSiteIcon };
