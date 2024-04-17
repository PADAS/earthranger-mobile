// External Dependencies
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

// Constants
const IMAGE_THUMBNAILS_OPTIONS = {
  width: 620,
  height: 620,
  quality: 100,
};

export const ATTACHMENTS_FOLDER = `${RNFS.DocumentDirectoryPath}/attachments`;
export const createThumbnail = async (imageURI: string) => {
  const thumbnailResponse = await ImageResizer.createResizedImage(
    imageURI,
    IMAGE_THUMBNAILS_OPTIONS.width,
    IMAGE_THUMBNAILS_OPTIONS.height,
    'JPEG',
    IMAGE_THUMBNAILS_OPTIONS.quality,
  );

  return thumbnailResponse;
};

export enum QualityType {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
