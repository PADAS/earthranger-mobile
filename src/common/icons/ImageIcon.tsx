// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ImageIcon = ({ width = '24', height = '24', color = COLORS_LIGHT.G0_black }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
    <Path d="M24 16.8V2.4C24 1.08 22.92 0 21.6 0H7.2C5.88 0 4.8 1.08 4.8 2.4V16.8C4.8 18.12 5.88 19.2 7.2 19.2H21.6C22.92 19.2 24 18.12 24 16.8ZM10.8 12L13.236 15.252L16.8 10.8L21.6 16.8H7.2L10.8 12ZM0 4.8V21.6C0 22.92 1.08 24 2.4 24H19.2V21.6H2.4V4.8H0Z" />
  </Svg>
);

export { ImageIcon };
