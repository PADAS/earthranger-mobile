// External Dependencies
import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import Config from 'react-native-config';
import RNFS, { exists, mkdir } from 'react-native-fs';

// Internal Dependencies
import {
  MAPBOX_STYLE_SATELLITE,
  MAPBOX_STYLE_STREETS,
  MAPBOX_STYLE_TOPO,
  getMapBoxStaticImageUrl,
} from '../../../api/EarthRangerService';
import { logGeneral } from '../../utils/logUtils';

export const useRetrieveBasemapThumbnails = () => {
  const retrieveBasemapThumbnails = useCallback(async () => {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const mapSize = (screenWidth / 3) - 32;
    const basemapThumbnailsFolder = `${RNFS.DocumentDirectoryPath}/basemaps/thumbnails/`;
    const folderExists = await exists(basemapThumbnailsFolder);

    if (!folderExists) {
      try {
        await mkdir(basemapThumbnailsFolder);
      } catch (error) {
        logGeneral.error(`Could not create thumbnails folder -> ${error}`);
      }
    }

    const BASEMAPS = [
      {
        type: 'topo',
        url: `${getMapBoxStaticImageUrl(MAPBOX_STYLE_TOPO)}/38.156485,-1.171775,14/${mapSize}x${mapSize}?access_token=${Config.MAPBOX_API_KEY}`,
      },
      {
        type: 'satellite',
        url: `${getMapBoxStaticImageUrl(MAPBOX_STYLE_SATELLITE)}/-122.087252,47.509963,15/${mapSize}x${mapSize}?access_token=${Config.MAPBOX_API_KEY}`,
      },
      {
        type: 'street',
        url: `${getMapBoxStaticImageUrl(MAPBOX_STYLE_STREETS)}/-103.427657,20.612844,14/${mapSize}x${mapSize}?access_token=${Config.MAPBOX_API_KEY}`,
      },
    ];

    for (let i = 0, l = BASEMAPS.length; i < l; i++) {
      const basemap = BASEMAPS[i];
      try {
        RNFS.downloadFile({
          fromUrl: basemap.url,
          toFile: [basemapThumbnailsFolder, `${basemap.type}.png`].join(''),
        });
      } catch (error) {
        logGeneral.error(`Basemap thumbnail for ${basemap.type} could not be downloaded -> ${error}`);
      }
    }
  }, []);

  return {
    retrieveBasemapThumbnails,
  };
};
