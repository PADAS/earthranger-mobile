// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';
import { COLORS_LIGHT } from '../constants/colors';

const RedoIcon = ({ width = '24', height = '11', color = COLORS_LIGHT.white }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 11">
    <Path d="M11.6893 1.17245C14.7963 1.17245 17.6102 2.33317 19.7792 4.22081L24 0V10.552H13.448L17.6922 6.30777C16.0625 4.94773 13.9873 4.10357 11.6893 4.10357C7.53884 4.10357 4.00977 6.81192 2.7787 10.552L0 9.63752C1.6297 4.72496 6.23742 1.17245 11.6893 1.17245Z" fill={color} />
  </Svg>
);

export { RedoIcon };
