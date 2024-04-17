import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

// Internal Dependencies
import { IconProps } from '../types/types';

const LocationIconHollow = ({ width = '12', height = '16', color }: IconProps) => (
  <Svg
    width={width}
    height={height}
  >
    <Path d="M5.5 14.8363C5.41623 14.7338 5.32485 14.6208 5.22711 14.4981C4.72101 13.8632 4.04738 12.9751 3.37519 11.9607C2.70162 10.9442 2.03844 9.81432 1.54586 8.69482C1.04907 7.56575 0.75 6.50095 0.75 5.6C0.75 2.90542 2.88618 0.75 5.5 0.75C8.11382 0.75 10.25 2.90542 10.25 5.6C10.25 6.50095 9.95093 7.56575 9.45414 8.69482C8.96156 9.81432 8.29838 10.9442 7.62481 11.9607C6.95262 12.9751 6.27899 13.8632 5.77289 14.4981C5.67515 14.6208 5.58377 14.7338 5.5 14.8363Z" stroke={color} stroke-width="1.5" />
    <Path d="M7.25 5.5C7.25 6.4665 6.4665 7.25 5.5 7.25C4.5335 7.25 3.75 6.4665 3.75 5.5C3.75 4.5335 4.5335 3.75 5.5 3.75C6.4665 3.75 7.25 4.5335 7.25 5.5Z" stroke={color} stroke-width="1.5" />
  </Svg>
);

export { LocationIconHollow };
