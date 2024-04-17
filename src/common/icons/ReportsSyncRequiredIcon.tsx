// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const ReportsSyncRequiredIcon = ({ width = '32', height = '25', color = COLORS_LIGHT.brightBlue }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 32 25 " fill={color}>
    <Path d="M25.8 8.1459C24.8933 3.49303 20.8533 0 16 0C14.0267 0 12.2 0.579923 10.6533 1.57793L12.6 3.54697C13.6133 3.00751 14.7733 2.69732 16 2.69732C20.0533 2.69732 23.3333 6.01502 23.3333 10.1149V10.7893H25.3333C27.5467 10.7893 29.3333 12.5965 29.3333 14.8352C29.3333 16.3592 28.48 17.6809 27.2533 18.3687L29.1867 20.3243C30.88 19.097 32 17.101 32 14.8352C32 11.2748 29.2667 8.38866 25.8 8.1459ZM4 1.7128L7.66667 5.40812C3.41333 5.59694 0 9.13042 0 13.4866C0 17.9507 3.58667 21.5785 8 21.5785H23.64L26.3067 24.2759L28 22.5631L5.69333 0L4 1.7128ZM10.3067 8.09195L20.9733 18.8812H8C5.05333 18.8812 2.66667 16.4671 2.66667 13.4866C2.66667 10.5061 5.05333 8.09195 8 8.09195H10.3067Z" />
  </Svg>
);

export { ReportsSyncRequiredIcon };
