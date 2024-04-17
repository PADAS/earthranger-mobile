// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const PatrolStartIcon = ({
  width = '18',
  height = '26',
  color = COLORS_LIGHT.white,
  viewbox = '0 0 18 26',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox} fill={color}>
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M4.8479 1.75092C6.09547 1.04054 7.50636 0.666874 8.942 0.666626C10.3777 0.666964 11.7886 1.04074 13.0362 1.75124C14.2837 2.46174 15.325 3.48452 16.0578 4.71914C16.7905 5.95376 17.1895 7.35774 17.2156 8.7932C17.2417 10.2287 16.8939 11.6462 16.2065 12.9066C16.1865 12.9954 9.73079 24.2109 9.73079 24.2109C9.65084 24.3494 9.53583 24.4645 9.39731 24.5444C9.2588 24.6244 9.10167 24.6665 8.94173 24.6665C8.78178 24.6665 8.62466 24.6244 8.48614 24.5444C8.34763 24.4645 8.23262 24.3494 8.15266 24.2109C8.15266 24.2109 1.6964 12.9952 1.67666 12.9057C0.989393 11.6452 0.641794 10.2277 0.668006 8.79231C0.694218 7.35691 1.09334 5.95301 1.82617 4.71849C2.559 3.48398 3.60034 2.46131 4.8479 1.75092ZM6.66663 13.4641L12.6666 9.99995L6.66663 6.53585L6.66663 13.4641Z" />
  </Svg>
);

export { PatrolStartIcon };
