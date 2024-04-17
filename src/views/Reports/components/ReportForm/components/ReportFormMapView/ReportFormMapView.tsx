// External Dependencies
import React from 'react';
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

// Internal Dependencies
import { COORDINATES_FORMAT_KEY } from '../../../../../../common/constants/constants';
import { formatCoordinates } from '../../../../../../common/utils/locationUtils';
import { localStorage } from '../../../../../../common/data/storage/keyValue';
import { EditIcon } from '../../../../../../common/icons/EditIcon';
import { Position } from '../../../../../../common/types/types';

// Styles
import styles from './ReportFormMapView.styles';

// Interfaces
interface MapViewProps {
  mapURL: string;
  reportCoordinates: Position;
  onMapPress: () => void;
  onCoordinatesPress: () => void;
}

export const MapView = ({
  mapURL,
  reportCoordinates,
  onMapPress,
  onCoordinatesPress,
}: MapViewProps) => {
  const [locationFormat] = useMMKVString(COORDINATES_FORMAT_KEY, localStorage);

  const parseLocationToSelectedFormat = () => formatCoordinates(
    reportCoordinates[1],
    reportCoordinates[0],
    locationFormat,
  );

  return (
    <View style={styles.mapContainer}>
      <Pressable onPress={onMapPress} style={styles.mapImage}>
        <Image style={styles.mapImage} source={{ uri: mapURL }} key={mapURL} />
      </Pressable>

      {/* Coordinates */}
      <View style={styles.mapCoordinatesContainer}>
        <Pressable onPress={onCoordinatesPress}>
          <Text style={styles.mapCoordinates}>
            {parseLocationToSelectedFormat()}
          </Text>
        </Pressable>
      </View>

      {/* Edit Icon */}
      <View style={styles.editIcon}>
        <TouchableOpacity onPress={onMapPress} style={styles.touchableArea}>
          <EditIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};
