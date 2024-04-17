// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const CameraIcon = ({ width = '48', height = '48', color = COLORS_LIGHT.G0_black }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 48 48" fill={color}>
    <Path d="M23.9983 27.8402C26.1191 27.8402 27.8383 26.1209 27.8383 24.0002C27.8383 21.8794 26.1191 20.1602 23.9983 20.1602C21.8776 20.1602 20.1583 21.8794 20.1583 24.0002C20.1583 26.1209 21.8776 27.8402 23.9983 27.8402Z" />
    <Path d="M20.4 12L18.204 14.4H14.4C13.08 14.4 12 15.48 12 16.8V31.2C12 32.52 13.08 33.6 14.4 33.6H33.6C34.92 33.6 36 32.52 36 31.2V16.8C36 15.48 34.92 14.4 33.6 14.4H29.796L27.6 12H20.4ZM24 30C20.688 30 18 27.312 18 24C18 20.688 20.688 18 24 18C27.312 18 30 20.688 30 24C30 27.312 27.312 30 24 30Z" />
  </Svg>
);

export { CameraIcon };
