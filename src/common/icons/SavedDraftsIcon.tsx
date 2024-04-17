// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const SavedDraftsIcon = ({ width = '32', height = '26', color = COLORS_LIGHT.magenta }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 32 26" fill={color}>
    <Path d="M12.8 0H3.2C1.44 0 0.016 1.44 0.016 3.2L0 22.4C0 24.16 1.44 25.6 3.2 25.6H28.8C30.56 25.6 32 24.16 32 22.4V6.4C32 4.64 30.56 3.2 28.8 3.2H16L12.8 0Z" />
  </Svg>
);

export { SavedDraftsIcon };
