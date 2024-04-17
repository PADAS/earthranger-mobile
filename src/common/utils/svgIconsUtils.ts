// Internal Dependencies
import { COLORS_LIGHT } from '../constants/colors';

export const mapPriorityToColor = (priority: number) => {
  let color = null;

  switch (priority) {
    case 0:
      color = COLORS_LIGHT.G2_secondaryMediumGray;
      break;
    case 100:
      color = COLORS_LIGHT.green;
      break;
    case 200:
      color = COLORS_LIGHT.amber;
      break;
    case 300:
      color = COLORS_LIGHT.red;
      break;
    default:
      break;
  }

  return color;
};

export const mapPriorityToBgColor = (priority: number) => {
  let color = null;

  switch (priority) {
    case 0:
      color = COLORS_LIGHT.G7_veryLightGrey;
      break;
    case 100:
      color = '#F5F7F3';
      break;
    case 200:
      color = '#FEF7F4';
      break;
    case 300:
      color = '#FDF2F4';
      break;
    default:
      break;
  }

  return color;
};

export const cleanUpSvg = (svg: string) => svg.replace(/fill="#[a-z0-9]{1,}"/g, '');
