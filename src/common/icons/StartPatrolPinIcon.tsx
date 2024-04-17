// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const StartPatrolPinIcon = ({
  width = '18',
  height = '26',
  color = COLORS_LIGHT.white,
}: IconProps) => (
  <Svg width={width} height={height} fill={color}>
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M4.848 1.75a8.277 8.277 0 0 1 8.188.001 8.278 8.278 0 0 1 3.17 11.156c-.02.088-6.475 11.304-6.475 11.304a.91.91 0 0 1-1.578 0S1.697 12.995 1.677 12.906A8.277 8.277 0 0 1 4.848 1.75Zm1.819 11.714 6-3.464-6-3.464v6.928Z"
      clipRule="evenodd"
    />
  </Svg>
);
export { StartPatrolPinIcon };
