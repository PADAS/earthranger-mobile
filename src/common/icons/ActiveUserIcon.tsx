// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ActiveUserIcon = ({
  width = '22',
  height = '22',
  color = COLORS_LIGHT.G2_5_mobileSecondaryGray,
}: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color}>
    <Path d="M11 0C4.928 0 0 4.928 0 11C0 17.072 4.928 22 11 22C17.072 22 22 17.072 22 11C22 4.928 17.072 0 11 0ZM11 3.3C12.826 3.3 14.3 4.774 14.3 6.6C14.3 8.426 12.826 9.9 11 9.9C9.174 9.9 7.7 8.426 7.7 6.6C7.7 4.774 9.174 3.3 11 3.3ZM11 18.92C8.25 18.92 5.819 17.512 4.4 15.378C4.433 13.189 8.8 11.99 11 11.99C13.189 11.99 17.567 13.189 17.6 15.378C16.181 17.512 13.75 18.92 11 18.92Z" />
  </Svg>
);

export { ActiveUserIcon };
