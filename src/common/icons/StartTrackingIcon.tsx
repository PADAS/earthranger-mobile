// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const StartTrackingIcon = ({
  width = '18',
  height = '18',
  color = COLORS_LIGHT.brightBlue,
}: IconProps) => (
  <Svg width={width} height={height} fill={color}>
    <Path
      fill="#0056C7"
      d="M18 0 0 7.524v.979l6.84 2.647 2.64 6.835h.98L18 0Z"
    />
  </Svg>
);
export { StartTrackingIcon };
