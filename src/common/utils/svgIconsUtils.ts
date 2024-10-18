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
      color = COLORS_LIGHT.G2_5_mobileSecondaryGray;
      break;
    case 100:
      color = '#006842';
      break;
    case 200:
      color = '#E76826';
      break;
    case 300:
      color = '#D0031B';
      break;
    default:
      break;
  }

  return color;
};

export const cleanUpSvg = (svg: string) => svg
  .replace(/fill="#[a-z0-9]{1,}"/g, '')
  .replace(/fill="[a-z]{1,}"/g, '')
  .replace(/<defs>.*<\/defs>/gi, '')
  .replace(/<title>.*<\/title>/gi, '')
  .replace(/<g class="a">.*<\/g>/gi, '');
