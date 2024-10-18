// External Dependencies
import React from 'react';
import {
  Svg, G, Circle,
} from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';

const DefaultEventTypeIcon = ({ width = '24', height = '24', color }: IconProps) => (
  <Svg width={width} height={height}>
    <G data-name="Layer 1">
      <Circle
        cx={parseInt(width, 10) / 2}
        cy={parseInt(height, 10) / 2}
        r={parseInt(width, 10) / 2}
        fill={color}
      />
    </G>
  </Svg>
);

export { DefaultEventTypeIcon };
