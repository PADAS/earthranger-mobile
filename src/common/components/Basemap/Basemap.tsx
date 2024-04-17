// External Dependencies
import MapboxGL from '@react-native-mapbox-gl/maps';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable } from 'react-native';
import { Image, Text, View } from 'react-native-ui-lib';
import Config from 'react-native-config';
import RNFS, { exists } from 'react-native-fs';

// Internal Dependencies
import { useMMKVString } from 'react-native-mmkv';
import {
  getMapBoxStaticImageUrl,
  MAPBOX_STYLE_SATELLITE,
  MAPBOX_STYLE_STREETS,
  MAPBOX_STYLE_TOPO,
} from '../../../api/EarthRangerService';
import {
  BASEMAP_KEY,
  BASEMAP_SATELLITE_LOCAL,
  BASEMAP_STREET_LOCAL,
  BASEMAP_TOPO_LOCAL, BOTTOM_SHEET_NAVIGATOR,
} from '../../constants/constants';
import { COLORS_LIGHT } from '../../constants/colors';
import { getStringForKey, localStorage, setStringForKey } from '../../data/storage/keyValue';
import { CloseIcon } from '../../icons/CloseIcon';

// Styles
import styles from './Basemap.styles';
import { getEventEmitter } from '../../utils/AppEventEmitter';
import { BottomSheetAction } from '../../enums/enums';

MapboxGL.setAccessToken(Config.MAPBOX_API_KEY);

// Interfaces + Types
interface BasemapProps {
  hideHeader: boolean
}

const Basemap = ({ hideHeader }: BasemapProps) => {
  // Hooks
  const { t } = useTranslation();

  // References
  const eventEmitter = useRef(getEventEmitter()).current;

  // Component's State
  const [basemapSelected, setBasemapSelected] = useState(
    getStringForKey(BASEMAP_KEY) || MapboxGL.StyleURL.Outdoors,
  );
  const [topoUrl, setTopoUrl] = useState<string | undefined>(
    getStringForKey(BASEMAP_TOPO_LOCAL) || undefined,
  );
  const [satelliteUrl, setSatelliteUrl] = useState<string | undefined>(
    getStringForKey(BASEMAP_SATELLITE_LOCAL) || undefined,
  );
  const [streetUrl, setStreetUrl] = useState<string | undefined>(
    getStringForKey(BASEMAP_STREET_LOCAL) || undefined,
  );
  const [basemapStatus] = useMMKVString(BASEMAP_KEY, localStorage);

  useEffect(() => {
    if (basemapSelected !== getStringForKey(BASEMAP_KEY)) {
      setBasemapSelected(getStringForKey(BASEMAP_KEY) || MapboxGL.StyleURL.Outdoors);
    }
  }, [basemapStatus]);

  useEffect(() => {
    // Constants
    const BASEMAPS_VALUES = [
      {
        type: 'topo',
        style: MAPBOX_STYLE_TOPO,
        coordinates: '38.156485,-1.171775',
        zoomLevel: '14',
        setValue: setTopoUrl,
        currentValue: topoUrl,
        key: BASEMAP_TOPO_LOCAL,
      },
      {
        type: 'satellite',
        style: MAPBOX_STYLE_SATELLITE,
        coordinates: '-122.087252,47.509963',
        zoomLevel: '15',
        setValue: setSatelliteUrl,
        currentValue: satelliteUrl,
        key: BASEMAP_SATELLITE_LOCAL,
      },
      {
        type: 'street',
        style: MAPBOX_STYLE_STREETS,
        coordinates: '-103.427657,20.612844',
        zoomLevel: '14',
        setValue: setStreetUrl,
        currentValue: streetUrl,
        key: BASEMAP_STREET_LOCAL,
      },
    ];

    const fetchImage = async (
      type: string,
      style: string,
      coordinates: string,
      zoomLevel: string,
      setValue: (value: React.SetStateAction<string | undefined>) => void,
      key: string,
    ) => {
      if (!await exists(`${RNFS.DocumentDirectoryPath}/basemaps/thumbnails/${type}.png`)) {
        // @TODO: Replace with the code to download the image and persist it to local storage
        const remoteUrl = `${getMapBoxStaticImageUrl(style)}/${coordinates},${zoomLevel}/${mapSize}x${mapSize}?access_token=${Config.MAPBOX_API_KEY}`;
        setValue(remoteUrl);
        setStringForKey(key, remoteUrl);
      } else {
        const localUrl = `file:///${RNFS.DocumentDirectoryPath}/basemaps/thumbnails/${type}.png`;
        setValue(localUrl);
        setStringForKey(key, localUrl);
      }
    };

    const fetchImages = async () => {
      for (let i = 0, l = BASEMAPS_VALUES.length; i < l; i++) {
        const {
          type,
          style,
          coordinates,
          zoomLevel,
          setValue,
          currentValue,
          key,
        } = BASEMAPS_VALUES[i];

        // eslint-disable-next-line no-await-in-loop
        if (!currentValue || !await exists(currentValue)) {
          // eslint-disable-next-line no-await-in-loop
          await fetchImage(type, style, coordinates, zoomLevel, setValue, key);
        }
      }
    };

    fetchImages();
  }, []);

  const screenWidth = Math.round(Dimensions.get('window').width);
  const mapSize = (screenWidth / 3) - 32;
  const BASEMAPS = useMemo(() => [
    {
      key: '1',
      type: 'topo',
      style: MapboxGL.StyleURL.Outdoors,
      url: topoUrl,
    },
    {
      key: '2',
      type: 'satellite',
      style: MapboxGL.StyleURL.Satellite,
      url: satelliteUrl,
    },
    {
      key: '3',
      type: 'street',
      style: MapboxGL.StyleURL.Street,
      url: streetUrl,
    },
  ], [topoUrl, satelliteUrl, streetUrl]);

  return (
    <View style={styles.bottomSheetBody}>
      { !hideHeader && (
        <View style={styles.bottomSheetHeader}>
          <Text heading1 style={styles.bottomSheetHeaderTitle}>
            {t('mapTrackLocation.basemaps')}
          </Text>
          <View style={styles.bottomSheetCloseButton}>
            <Pressable
              onPress={() => {
                eventEmitter.emit(
                  BOTTOM_SHEET_NAVIGATOR,
                  { bottomSheetAction: BottomSheetAction.dismiss },
                );
              }}
              hitSlop={20}
            >
              <CloseIcon />
            </Pressable>
          </View>
        </View>
      ) }
      <View style={styles.bottomSheetMapsContainer}>
        {BASEMAPS.map((BASEMAP) => (
          <View
            style={[
              styles.bottomSheetMapItem,
            ]}
            key={BASEMAP.key}
          >
            <Pressable onPress={() => {
              setBasemapSelected(BASEMAP.style);
              setStringForKey(BASEMAP_KEY, BASEMAP.style);
            }}
            >
              <View
                style={[
                  BASEMAP.style === basemapSelected
                    ? styles.bottomSheetMapItemSelected
                    : styles.bottomSheetMapItemUnselected,
                ]}
              >
                <Image
                  style={{
                    width: mapSize,
                    borderRadius: 3,
                    height: mapSize,
                  }}
                  source={{ uri: BASEMAP.url }}
                />
              </View>
            </Pressable>
            <Text
              caption
              color={
                BASEMAP.style === basemapSelected
                  ? COLORS_LIGHT.brightBlue
                  : COLORS_LIGHT.G0_black
              }
            >
              {t(`mapTrackLocation.${BASEMAP.type}`)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export { Basemap };
