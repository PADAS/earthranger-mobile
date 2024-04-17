// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const RoundedPlusIcon = ({ width = '22', height = '22', color = COLORS_LIGHT.white }: IconProps) => (
  <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill={color}>
    <Path d="M11 0C8.10025 0.0563216 5.33578 1.23334 3.28496 3.28416C1.23414 5.33497 0.0563216 8.10025 0 11C0 13.9174 1.15976 16.7153 3.22266 18.7782C5.28556 20.841 8.08262 22 11 22C13.9174 22 16.7155 20.841 18.7784 18.7782C20.8413 16.7153 22 13.9174 22 11C22 8.08262 20.8413 5.28475 18.7784 3.22185C16.7155 1.15895 13.9174 0 11 0ZM16.5 12.1H12.1V16.5H9.9V12.1H5.5V9.9H9.9V5.5H12.1V9.9H16.5V12.1Z" />
  </Svg>
);

export { RoundedPlusIcon };
