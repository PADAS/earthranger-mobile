// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LocationCompassIcon = ({ width = '18', height = '18', color = COLORS_LIGHT.brightBlue }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 18" fill={color}>
    <Path d="M9 8.01C8.451 8.01 8.01 8.451 8.01 9C8.01 9.549 8.451 9.99 9 9.99C9.549 9.99 9.99 9.549 9.99 9C9.99 8.451 9.549 8.01 9 8.01ZM9 0C4.032 0 0 4.032 0 9C0 13.968 4.032 18 9 18C13.968 18 18 13.968 18 9C18 4.032 13.968 0 9 0ZM10.971 10.971L3.6 14.4L7.029 7.029L14.4 3.6L10.971 10.971Z" />
  </Svg>
);

export { LocationCompassIcon };
