// External Dependencies
import React from 'react';
import {
  Svg,
  Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const StopTrackingIcon = ({ width = '15', height = '16', color = COLORS_LIGHT.red }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 15 16">
    <Path d="M7.71698 15.4623L5.56604 9.93396L0.0377358 7.78302V6.9717L4.13208 5.4434L0 1.31132L0.811321 0.5L15 14.6887L14.1887 15.5L10.0566 11.3679L8.5283 15.4623H7.71698ZM10.9434 9.00943L6.49057 4.5566L13.6226 1.87736L10.9434 9.00943Z" fill={color} />
  </Svg>
);

export { StopTrackingIcon };
