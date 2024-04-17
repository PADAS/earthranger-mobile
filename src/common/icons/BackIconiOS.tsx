/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const BackIconiOS = ({ width = '40', height = '40', color = COLORS_LIGHT.G2_secondaryMediumGray }: IconProps) => (
  <Svg
    width={width}
    height={height}
    fill={color}
  >
    <Path
      d="m23 28-8-8 8-8 1.12 1.14L17.26 20l6.86 6.86L23 28Z"
    />
  </Svg>
);

export { BackIconiOS };
