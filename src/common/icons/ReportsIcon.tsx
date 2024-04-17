import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';

const ReportsIcon = ({ width = '12', height = '16', color }: IconProps) => (
  <Svg
    width={width}
    height={height}
  >
    <Path
      d="M8 0H1.6C.72 0 .008.72.008 1.6L0 14.4c0 .88.712 1.6 1.592 1.6H11.2c.88 0 1.6-.72 1.6-1.6V4.8L8 0zm1.6 12.8H3.2v-1.6h6.4v1.6zm0-3.2H3.2V8h6.4v1.6zm-2.4-4V1.2l4.4 4.4H7.2z"
      fill={color}
    />
  </Svg>
);

export { ReportsIcon };
