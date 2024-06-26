// External Dependencies
import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';
import { IconProps } from '../types/types';

const NoEventsIcon = ({ width = '20', height = '20', color = COLORS_LIGHT.G1_off_black }: IconProps) => (
  <Svg
    width={width}
    height={height}
    fill="none"
  >
    <G fill={color}>
      <Path d="M9.028 14.222H3.61v-1.778H9.53a5.624 5.624 0 0 1 1.204-1.777H3.61V8.889h7.222v1.679a5.856 5.856 0 0 1 3.611-1.68V5.334L9.028 0H1.806A1.83 1.83 0 0 0 .529.52 1.777 1.777 0 0 0 0 1.779V16a1.754 1.754 0 0 0 .529 1.257 1.808 1.808 0 0 0 1.277.52H9.83a5.954 5.954 0 0 1-.802-2.962v-.593ZM8.125 1.284l4.915 4.938H8.125V1.284Z" />
      <Path
        fillRule="evenodd"
        d="M15 10a5 5 0 0 0 0 10 5.1 5.1 0 0 0 5-5 5 5 0 0 0-5-5Zm-.496 6.398h.726c0-.192.025-.372.075-.539a.996.996 0 0 1 .289-.449c.166-.156.324-.32.472-.492.149-.172.27-.355.364-.55.096-.199.144-.415.144-.65 0-.304-.061-.567-.183-.788a1.234 1.234 0 0 0-.535-.516c-.232-.12-.514-.18-.844-.18-.3 0-.57.056-.813.168a1.386 1.386 0 0 0-.578.485c-.14.21-.213.463-.219.758h.723a.74.74 0 0 1 .129-.442.739.739 0 0 1 .328-.254c.135-.054.279-.082.43-.082.182 0 .334.035.457.106.125.07.219.17.281.3.065.13.098.286.098.465 0 .177-.032.33-.094.457a1.506 1.506 0 0 1-.246.352c-.1.107-.208.221-.328.344-.164.169-.296.32-.395.453-.099.133-.17.28-.215.441a2.585 2.585 0 0 0-.066.613Zm.078.942a.427.427 0 0 0-.11.297c0 .112.037.208.11.289.073.08.178.12.316.12.141 0 .248-.04.32-.12a.417.417 0 0 0 .11-.29.427.427 0 0 0-.11-.296c-.072-.08-.179-.121-.32-.121-.138 0-.243.04-.316.12Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
);
export default NoEventsIcon;
