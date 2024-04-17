// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ReportsSyncNotRequiredIcon = ({ width = '32', height = '21', color = COLORS_LIGHT.brightBlue }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 32 21" fill={color}>
    <Path d="M25.8 7.9275C24.8933 3.39937 20.8533 0 16 0C12.1467 0 8.8 2.1525 7.13333 5.3025C3.12 5.7225 0 9.06938 0 13.125C0 17.4694 3.58667 21 8 21H25.3333C29.0133 21 32 18.06 32 14.4375C32 10.9725 29.2667 8.16375 25.8 7.9275ZM13.3333 17.0625L8.66667 12.4688L10.5467 10.6181L13.3333 13.3481L20.24 6.5625L22.12 8.41313L13.3333 17.0625Z" />
  </Svg>
);

export { ReportsSyncNotRequiredIcon };
