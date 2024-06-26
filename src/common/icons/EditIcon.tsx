// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const EditIcon = ({
  width = '14',
  height = '14',
  color = COLORS_LIGHT.G0_black,
  viewbox = '0 0 14 14',
}: IconProps) => (
  <Svg width={width} height={height} viewBox={viewbox} fill={color}>
    <Path d="M0 11.0837V14H2.91626L11.5173 5.39897L8.60103 2.48271L0 11.0837ZM13.7725 3.14373C14.0758 2.84044 14.0758 2.35051 13.7725 2.04722L11.9528 0.227468C11.6495 -0.0758228 11.1596 -0.0758228 10.8563 0.227468L9.43313 1.6506L12.3494 4.56687L13.7725 3.14373Z" fill-opacity="0.85" />
  </Svg>
);

export { EditIcon };
