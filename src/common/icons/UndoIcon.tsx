// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';
import { COLORS_LIGHT } from '../constants/colors';

const UndoIcon = ({ width = '24', height = '11', color = COLORS_LIGHT.white }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 11">
    <Path d="M12.3107 1.17245C9.20371 1.17245 6.38984 2.33317 4.22081 4.22081L0 0V10.552H10.552L6.30777 6.30777C7.93747 4.94773 10.0127 4.10357 12.3107 4.10357C16.4612 4.10357 19.9902 6.81192 21.2213 10.552L24 9.63752C22.3703 4.72496 17.7626 1.17245 12.3107 1.17245Z" fill={color} />
  </Svg>
);

export { UndoIcon };
