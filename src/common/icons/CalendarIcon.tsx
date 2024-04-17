// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const CalendarIcon = ({
  width = '15',
  height = '16',
  color = COLORS_LIGHT.G3_secondaryMediumLightGray,
}: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 15 16" fill={color}>
    <Path
      d="M13.09 1.455h-.726V0h-1.455v1.455H3.636V0H2.182v1.455h-.727C.655 1.455 0 2.109 0 2.909v11.637C0 15.346.655 16 1.455 16H13.09c.8 0 1.455-.655 1.455-1.454V2.909c0-.8-.655-1.454-1.455-1.454Zm0 13.09H1.456v-8H13.09v8Zm0-9.454H1.456V2.909H13.09v2.182Z"
    />
  </Svg>
);

export { CalendarIcon };
