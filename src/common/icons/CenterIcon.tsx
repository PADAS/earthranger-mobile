/* eslint-disable max-len */

// External Dependencies
import { Svg, Path } from 'react-native-svg';
import React from 'react';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const CenterIcon = ({ width = '20', height = '21', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 21" fill={color}>
    <Path
      d="M4.16667 12.8922H2.5V16.2255C2.5 17.1422 3.25 17.8922 4.16667 17.8922H7.5V16.2255H4.16667V12.8922ZM4.16667 4.55888H7.5V2.89221H4.16667C3.25 2.89221 2.5 3.64221 2.5 4.55888V7.89221H4.16667V4.55888ZM15.8333 2.89221H12.5V4.55888H15.8333V7.89221H17.5V4.55888C17.5 3.64221 16.75 2.89221 15.8333 2.89221ZM15.8333 16.2255H12.5V17.8922H15.8333C16.75 17.8922 17.5 17.1422 17.5 16.2255V12.8922H15.8333V16.2255ZM10 7.89221C8.61667 7.89221 7.5 9.00888 7.5 10.3922C7.5 11.7755 8.61667 12.8922 10 12.8922C11.3833 12.8922 12.5 11.7755 12.5 10.3922C12.5 9.00888 11.3833 7.89221 10 7.89221Z"
    />
  </Svg>
);

export { CenterIcon };
