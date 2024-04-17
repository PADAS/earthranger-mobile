import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';

const LocationIcon = ({ width = '12', height = '16', color }: IconProps) => (
  <Svg
    width={width}
    height={height}
  >
    <Path
      d="M5.6 0A5.596 5.596 0 0 0 0 5.6C0 9.8 5.6 16 5.6 16s5.6-6.2 5.6-10.4C11.2 2.504 8.696 0 5.6 0Zm0 7.6a2 2 0 1 1 .001-4.001A2 2 0 0 1 5.6 7.6Z"
      fill={color}
    />
  </Svg>
);

export { LocationIcon };
