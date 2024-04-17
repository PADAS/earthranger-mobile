// External Dependencies
import React from 'react';
import {
  Svg, Path, G, Circle,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';

const DefaultEventTypeIcon = ({ width = '24', height = '24', color }: IconProps) => (
  <Svg width={width} height={height}>
    <G data-name="Layer 2">
      <G data-name="Layer 1">
        <G fill="#fff" opacity=".8">
          <Circle cx="7.5" cy="7.5" r="6.75" />
          <Path d="M7.5 1.5a6 6 0 1 1-6 6 6 6 0 0 1 6-6m0-1.5A7.5 7.5 0 1 0 15 7.5 7.508 7.508 0 0 0 7.5 0Z" />
        </G>
        <Circle
          cx={parseInt(width, 10) / 2}
          cy={parseInt(height, 10) / 2}
          r={parseInt(width, 10) / 2}
          fill={color}
        />
      </G>
    </G>
  </Svg>
);

export { DefaultEventTypeIcon };
