// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LogOutIcon = ({ width = '20', height = '20', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color}>
    <Path d="M16.5 4.4L14.949 5.951L17.787 8.8H6.6V11H17.787L14.949 13.838L16.5 15.4L22 9.9L16.5 4.4ZM2.2 2.2H11V0H2.2C0.99 0 0 0.99 0 2.2V17.6C0 18.81 0.99 19.8 2.2 19.8H11V17.6H2.2V2.2Z" />
  </Svg>
);

export { LogOutIcon };
