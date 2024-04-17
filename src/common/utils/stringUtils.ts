import { Dimensions } from 'react-native';

const CHARACTER_WIDTH = 17; // Approximate value to calculate the length of the title

export const cropHeaderTitleText = (title: string, substract: number = 0) => {
  if (!title) return '';

  const maxTitleLength = (Dimensions.get('window').width / CHARACTER_WIDTH) - substract;

  return title.length > maxTitleLength
    ? `${title.substring(0, maxTitleLength)}...` : title;
};

export const isEmptyString = (value: string | undefined) => (value === undefined
    || value === null
    || value.trim().length === 0);
