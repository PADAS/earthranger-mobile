// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const PlayIcon = ({ width = '11', height = '14', color = COLORS_LIGHT.white }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 11 14" fill={color}>
    <Path d="M0 0V14L11 7L0 0Z" />
  </Svg>
);

export { PlayIcon };
