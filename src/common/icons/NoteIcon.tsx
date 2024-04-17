// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const NoteIcon = ({ width = '24', height = '24', color = COLORS_LIGHT.G0_black }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color}>
    <Path d="M21.3333 2.66667V14.6667H14.6667V21.3333H2.66667V2.66667H21.3333ZM21.3333 0H2.66667C1.2 0 0 1.2 0 2.66667V21.3333C0 22.8 1.2 24 2.66667 24H16L24 16V2.66667C24 1.2 22.8 0 21.3333 0ZM12 14.6667H5.33333V12H12V14.6667ZM18.6667 9.33333H5.33333V6.66667H18.6667V9.33333Z" />
  </Svg>
);

export { NoteIcon };
