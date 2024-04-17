// External Dependencies
import React from 'react';
import {
  Svg, Path, Circle,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

export const ReportFormErrorIcon = ({ width = '44', height = '44', color = COLORS_LIGHT.G3_secondaryMediumLightGray }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 44 44" fill={color}>
    <Path d="M19.9998 31.9999H8.00014V27.9999H21.1109C21.7363 26.5086 22.6414 25.1509 23.7774 24H8.00014V20H23.9999V23.7778C26.1373 21.6141 28.9712 20.2759 32 20V11.9999L19.9998 0H4.00007C3.47479 0 2.95489 0.103479 2.46959 0.304498C1.9843 0.505516 1.54329 0.800169 1.17186 1.1716C0.800433 1.54304 0.505376 1.98391 0.304359 2.46921C0.103342 2.95451 0 3.47469 0 3.99997V36C0 36.5253 0.103342 37.0454 0.304359 37.5307C0.505376 38.016 0.800433 38.457 1.17186 38.8284C1.54329 39.1998 1.9843 39.4945 2.46959 39.6955C2.95489 39.8965 3.47479 40 4.00007 40H21.7777C20.62 37.9683 20.0075 35.6717 19.9998 33.3333V31.9999ZM18 2.88886L28.8886 14H18V2.88886Z" />
    <Path d="M33 22C30.0826 22 27.285 23.159 25.2221 25.2219C23.1592 27.2848 22 30.0826 22 33C22 35.9174 23.1592 38.7153 25.2221 40.7782C27.285 42.841 30.0826 44 33 44C35.8997 43.9437 38.6653 42.7667 40.7161 40.7158C42.7669 38.665 43.9437 35.8997 44 33C44 30.0826 42.8413 27.2848 40.7784 25.2219C38.7155 23.159 35.9174 22 33 22ZM38.5 34.1H34.1V38.5H31.9V34.1H27.5V31.9H31.9V27.5H34.1V31.9H38.5V34.1Z" />
    <Circle cx="33" cy="33" r="11" />
    <Path d="M33.9062 27.2031L33.6162 36.0889H31.5068L31.208 27.2031H33.9062ZM31.1377 38.8398C31.1377 38.4648 31.2666 38.1543 31.5244 37.9082C31.7881 37.6562 32.1338 37.5303 32.5615 37.5303C32.9951 37.5303 33.3408 37.6562 33.5986 37.9082C33.8564 38.1543 33.9854 38.4648 33.9854 38.8398C33.9854 39.2031 33.8564 39.5107 33.5986 39.7627C33.3408 40.0146 32.9951 40.1406 32.5615 40.1406C32.1338 40.1406 31.7881 40.0146 31.5244 39.7627C31.2666 39.5107 31.1377 39.2031 31.1377 38.8398Z" fill="white" />
  </Svg>
);