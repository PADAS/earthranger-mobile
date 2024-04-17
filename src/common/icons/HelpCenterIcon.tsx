// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const HelpCenterIcon = ({ width = '20', height = '20', color = COLORS_LIGHT.G2_5_mobileSecondaryGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill={color} stroke={color}>
    <Path
      strokeWidth={0.25}
      d="M2.76 5.486v5.65H1.4a.512.512 0 0 0-.525.518c0 .296.23.518.525.518h1.418v6.323c0 .352.287.63.64.63h11.028c.352 0 .639-.278.639-.63V5.417l-.002-.012c-.07-.344-.355-.549-.694-.549H3.4a.632.632 0 0 0-.64.63Zm4.438 4.127 1.496 1.468H3.868V5.89H13.96v12.087H3.868v-5.862h4.826l-1.439 1.412a.56.56 0 0 0 0 .795l.018.018.024.009.286.112.046.018.045-.018.286-.112.024-.01.018-.017 2.343-2.3a.56.56 0 0 0 0-.794l-.001-.002-2.33-2.23a.309.309 0 0 0-.187-.14c-.067-.02-.14-.02-.192-.02H7.622c-.052 0-.125 0-.191.02A.309.309 0 0 0 7.24 9a.553.553 0 0 0-.136.278.373.373 0 0 0 .093.335Zm-1.97-5.684h10.733v12.619l.004.016c.067.265.279.486.578.486a.512.512 0 0 0 .525-.517V2.838H5.286a.441.441 0 0 0-.354.158.554.554 0 0 0-.114.34c-.068.24.098.52.38.59l.015.003h.016ZM7.344 1.91h10.675v12.676l.004.015c.067.265.279.487.578.487a.512.512 0 0 0 .525-.518V.875H7.343a.512.512 0 0 0-.525.518c0 .295.23.517.525.517Z"
    />
  </Svg>
);

export { HelpCenterIcon };
