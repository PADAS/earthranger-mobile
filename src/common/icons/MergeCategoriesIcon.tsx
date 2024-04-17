// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const MergeCategoriesIcon = ({ width = '20', height = '20', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color}>
    <Path d="M11 0H2.2C0.99 0 0.0110003 0.99 0.0110003 2.2L0 19.8C0 21.01 0.979 22 2.189 22H15.4C16.61 22 17.6 21.01 17.6 19.8V6.6L11 0ZM13.2 17.6H4.4V15.4H13.2V17.6ZM13.2 13.2H4.4V11H13.2V13.2ZM9.9 7.7V1.65L15.95 7.7H9.9Z" />
  </Svg>
);

export { MergeCategoriesIcon };
