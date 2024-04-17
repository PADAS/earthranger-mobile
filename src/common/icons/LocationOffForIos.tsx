// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';

const LocationOffForIos = ({ width = '18', height = '18' }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 18">
    <Path d="M7.77292 10.7999L7.61367 10.3873L7.20126 10.2275L1.45999 8.00321L16.1349 1.8642L9.98791 16.5388L7.77292 10.7999Z" stroke="#888B8D" strokeWidth="2" />
  </Svg>
);

export { LocationOffForIos };
