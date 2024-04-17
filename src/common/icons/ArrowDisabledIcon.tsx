// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';

const ArrowDisabledIcon = ({ width = '20', height = '20', color = '#63666A' }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill={color}>
    <Path d="M9.26038 17.9547L6.67925 11.3208L0.045283 8.73962V7.76604L4.95849 5.93208L0 0.973585L0.973585 0L18 17.0264L17.0264 18L12.0679 13.0415L10.234 17.9547H9.26038ZM13.1321 10.2113L7.78868 4.86792L16.3472 1.65283L13.1321 10.2113Z" />
  </Svg>
);

export { ArrowDisabledIcon };
