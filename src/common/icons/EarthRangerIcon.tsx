// External Dependencies
import React from 'react';
import {
  Svg, Path,
} from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const EarthRangerIcon = ({ width = '194', height = '91', color = COLORS_LIGHT.white }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 194 91" fill={color}>
    <Path d="M1.98877 87.0188V59.6375H13.9616V63.6188H6.49379V71.1344H12.744V75.1156H6.49379V83.0375H14.0833V87.0188H1.98877Z" />
    <Path d="M26.7864 80.925H21.7943L20.8203 87.0188H16.437L21.5102 59.6375H27.2328L32.3872 87.0188H27.7604L26.7864 80.925ZM26.2182 77.1469L24.3107 65L22.3625 77.1469H26.2182Z" />
    <Path d="M45.6994 87.0188L42.2496 76.0906H39.9768V87.0188H35.4312V59.6375H42.4931C46.6328 59.6375 49.3927 61.2625 49.3927 65.4063V70.3219C49.3927 72.9219 48.2968 74.5875 46.4299 75.4L50.3261 87.0188H45.6994ZM39.9768 72.1906H42.3307C43.8324 72.1906 44.8471 71.6625 44.8471 69.6719V66.1375C44.8471 64.1875 43.8324 63.6188 42.3307 63.6188H39.9768V72.1906Z" />
    <Path d="M65.7082 63.6188H61.1626V87.0188H56.617V63.6188H52.0308V59.6375H65.7082V63.6188Z" />
    <Path d="M73.3791 59.6375V71.0531H78.5741V59.6375H83.1197V87.0188H78.5741V75.1156H73.3791V87.0188H68.8335V59.6375H73.3791Z" />
    <Path d="M98.0553 87.0188L94.6055 76.0906H92.3327V87.0188H87.7871V59.6375H94.8896C99.0294 59.6375 101.749 61.2625 101.749 65.4063V70.3219C101.749 72.9219 100.653 74.5875 98.7859 75.4L102.682 87.0188H98.0553ZM92.3327 72.1906H94.7273C96.1884 72.1906 97.203 71.6625 97.203 69.6719V66.1375C97.203 64.1875 96.1884 63.6188 94.7273 63.6188H92.3327V72.1906Z" />
    <Path d="M114.898 80.925H109.906L108.932 87.0188H104.549L109.622 59.6375H115.345L120.499 87.0188H115.913L114.898 80.925ZM114.33 77.1469L112.422 65L110.515 77.1469H114.33Z" />
    <Path d="M123.543 87.0188V59.6375H128.089L133.852 76.5781V59.6375H137.992V87.0188H133.689L127.683 69.225V87.0188H123.543Z" />
    <Path d="M156.58 81.5344C156.58 85.7594 153.861 87.3438 149.68 87.3438H149.396C145.256 87.3438 142.497 85.8 142.497 81.5344V65.1219C142.497 61.0594 145.256 59.3125 149.396 59.3125H149.68C153.861 59.3125 156.58 61.0594 156.58 65.1219V69.0219H152.034V65.8125C152.034 63.8625 151.02 63.2938 149.559 63.2938C148.097 63.2938 147.042 63.8625 147.042 65.8125V80.8438C147.042 82.7938 148.057 83.3625 149.559 83.3625C151.06 83.3625 152.034 82.7938 152.034 80.8438V76.7812H149.396V72.9219H156.58V81.5344Z" />
    <Path d="M161.044 87.0188V59.6375H173.017V63.6188H165.549V71.1344H171.8V75.1156H165.549V83.0375H173.139V87.0188H161.044Z" />
    <Path d="M187.425 87.0188L183.935 76.0906H181.662V87.0188H177.116V59.6375H184.219C188.358 59.6375 191.078 61.2625 191.078 65.4063V70.3219C191.078 72.9219 189.982 74.5875 188.115 75.4L192.011 87.0188H187.425ZM181.662 72.1906H184.056C185.517 72.1906 186.532 71.6625 186.532 69.6719V66.1375C186.532 64.1875 185.517 63.6188 184.056 63.6188H181.662V72.1906Z" />
    <Path d="M110.962 29.7781V30.5094C110.962 33.0688 110.515 35.9531 106.984 38.025L97.0001 44.2813L86.6507 38.025C83.0386 35.75 83.0386 31.9719 83.0386 30.5094V29.7781H110.962Z" />
    <Path d="M97.0001 3.65625L82.3486 6.05312L83.0386 14.5031H110.962L111.652 6.05312L97.0001 3.65625Z" />
    <Path d="M107.634 16.7375L83.0386 16.7781V27.1781H107.634V16.7375Z" />
  </Svg>
);

export { EarthRangerIcon };