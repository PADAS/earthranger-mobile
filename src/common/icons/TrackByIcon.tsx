// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const TrackByIcon = ({ width = '20', height = '20', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color}>
    <Path d="M20 0L0 8.35944V9.44739L7.6 12.3893L10.5333 19.9827H11.6222L20 0Z" />
  </Svg>
);

export { TrackByIcon };
