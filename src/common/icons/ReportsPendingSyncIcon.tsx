// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const PendingSyncIcon = ({ width = '32', height = '32', color = COLORS_LIGHT.indigo }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 32" fill={color}>
    <Path d="M11.6364 4.36364V0L5.81818 5.81818L11.6364 11.6364V7.27273C16.4509 7.27273 20.3636 11.1855 20.3636 16C20.3636 17.4691 20 18.8655 19.3455 20.0727L21.4691 22.1964C22.6036 20.4073 23.2727 18.2836 23.2727 16C23.2727 9.57091 18.0655 4.36364 11.6364 4.36364ZM11.6364 24.7273C6.82182 24.7273 2.90909 20.8145 2.90909 16C2.90909 14.5309 3.27273 13.1345 3.92727 11.9273L1.80364 9.80364C0.669091 11.5927 0 13.7164 0 16C0 22.4291 5.20727 27.6364 11.6364 27.6364V32L17.4545 26.1818L11.6364 20.3636V24.7273Z" />
  </Svg>
);

export { PendingSyncIcon };
