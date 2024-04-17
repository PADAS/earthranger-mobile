// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const SwitchTrackedByUser = ({ width = '22', height = '22', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color}>
    <Path fillRule="evenodd" d="M8.636 0A8.64 8.64 0 0 0 0 8.636a8.64 8.64 0 0 0 10.259 8.484 5.452 5.452 0 0 1-.206-2.428 6.224 6.224 0 0 1-6.598-2.618c.025-1.719 3.454-2.66 5.181-2.66 1.158 0 3.095.427 4.244 1.23A5.43 5.43 0 0 1 15.454 10c.581 0 1.141.09 1.666.259A8.64 8.64 0 0 0 8.636 0Zm0 2.59a2.587 2.587 0 0 1 2.591 2.592 2.587 2.587 0 0 1-2.59 2.59 2.587 2.587 0 0 1-2.592-2.59A2.587 2.587 0 0 1 8.636 2.59Z" clipRule="evenodd" />
    <Path fillRule="evenodd" d="m14.41 20-.228-1.432a3.045 3.045 0 0 1-.455-.216 3.12 3.12 0 0 1-.42-.284l-1.341.614-1.057-1.864 1.227-.898a1.339 1.339 0 0 1-.028-.232 5.407 5.407 0 0 1 0-.466c.004-.088.013-.165.028-.233l-1.227-.898 1.057-1.864 1.34.614a3.12 3.12 0 0 1 .421-.284c.16-.091.31-.16.455-.205l.227-1.443H16.5l.227 1.432c.144.053.298.123.46.21.163.087.302.184.415.29l1.341-.614L20 14.091l-1.227.875c.015.076.024.157.028.244a5.628 5.628 0 0 1 0 .483 1.577 1.577 0 0 1-.028.239l1.227.886-1.057 1.864-1.34-.614c-.122.099-.26.195-.416.29a1.982 1.982 0 0 1-.46.21L16.5 20h-2.09Zm2.18-4.546a1.136 1.136 0 1 1-2.272 0 1.136 1.136 0 0 1 2.273 0Z" clipRule="evenodd" />
  </Svg>
);

export { SwitchTrackedByUser };
