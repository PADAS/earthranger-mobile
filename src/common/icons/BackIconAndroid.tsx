/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const BackIconAndroid = ({ width = '16', height = '16', color = COLORS_LIGHT.G2_secondaryMediumGray }: IconProps) => (
  <Svg
    width={width}
    height={height}
    fill={color}
  >
    <Path
      d="M16 7H3.83l5.59-5.59L8 0 0 8l8 8 1.41-1.41L3.83 9H16V7Z"
    />
  </Svg>
);

export { BackIconAndroid };
