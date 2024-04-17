// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const FolderIcon = ({
  width = '32',
  height = '32',
  color = COLORS_LIGHT.G0_black,
  viewbox = '0 0 24 24',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox} fill={color}>
    <Path d="M6.4 0.599976H1.6C0.72 0.599976 0.00799999 1.31998 0.00799999 2.19998L0 11.8C0 12.68 0.72 13.4 1.6 13.4H14.4C15.28 13.4 16 12.68 16 11.8V3.79998C16 2.91998 15.28 2.19998 14.4 2.19998H8L6.4 0.599976Z" />
  </Svg>
);

export { FolderIcon };
