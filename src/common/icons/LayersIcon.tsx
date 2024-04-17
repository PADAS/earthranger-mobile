// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const LayersIcon = ({ width = '32', height = '22', color = COLORS_LIGHT.G2_secondaryMediumGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 32 22" fill={color}>
    <Path
      fill={color}
      fillRule="evenodd"
      d="M.943 11.396c.124 0 .248.023.356.069h.008l8.697 3.515 8.69-3.515h.007a.927.927 0 0 1 .356-.069c.518 0 .935.41.935.917 0 .379-.24.712-.58.849L10.36 16.82h-.008a.93.93 0 0 1-.356.068.929.929 0 0 1-.355-.068h-.008L.58 13.16a.913.913 0 0 1-.58-.848c0-.508.417-.917.935-.917"
      clipRule="evenodd"
    />
    <Path
      fill={color}
      fillRule="evenodd"
      d="m19.42 9.404-9.053 3.66h-.008a.927.927 0 0 1-.355.067.927.927 0 0 1-.356-.068h-.007L.588 9.404a.913.913 0 0 1-.58-.848c0-.508.417-.917.935-.917.124 0 .248.023.356.068h.008l8.69 3.515 8.689-3.515h.008a.928.928 0 0 1 .355-.068c.518 0 .936.409.936.917a.91.91 0 0 1-.58.84"
      clipRule="evenodd"
    />
    <Path
      fill={color}
      fillRule="evenodd"
      d="m19.42 5.646-9.053 3.66h-.008a.927.927 0 0 1-.355.068.928.928 0 0 1-.356-.068h-.007L.588 5.646a.913.913 0 0 1-.58-.848c0-.386.24-.712.58-.849L9.64.29h.007a.928.928 0 0 1 .356-.068c.124 0 .247.023.356.068h.007l9.053 3.66c.34.136.58.462.58.848 0 .386-.24.712-.58.848Z"
      clipRule="evenodd"
    />
  </Svg>
);

export { LayersIcon };
