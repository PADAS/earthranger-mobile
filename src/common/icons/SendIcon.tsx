// External Dependencies
import React from 'react';
import {
  Svg,
  Path,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';
import { COLORS_LIGHT } from '../constants/colors';

const SendIcon = ({ width = '18', height = '18', color = COLORS_LIGHT.brightBlue }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 18">
    <Path
      d="M0 16.1579V1L18 8.57895L0 16.1579ZM1.42105 13.9553L14.3053 8.57895L1.42105 3.13158V7.11053L7.15263 8.57895L1.42105 10V13.9553Z"
      fill={color}
    />
  </Svg>
);

export { SendIcon };
