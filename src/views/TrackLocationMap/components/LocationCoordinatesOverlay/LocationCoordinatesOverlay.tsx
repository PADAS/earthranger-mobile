// External Dependencies
import React, { useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native-ui-lib';
import Clipboard from '@react-native-community/clipboard';

// Internal Dependencies
import { getTopAreaInsets } from '../../../../common/utils/safeAreaInsets';
import { Position } from '../../../../common/types/types';
import { formatCoordinates } from '../../../../common/utils/locationUtils';
import { getStringForKey } from '../../../../common/data/storage/keyValue';
import { COORDINATES_FORMAT_KEY } from '../../../../common/constants/constants';

// Styles
import styles from './LocationCoordinatesOverlay.styles';

interface LocationCoordinatesOverlayProps {
  location: Position
  displayToast: React.Dispatch<React.SetStateAction<boolean>>
}

const LocationCoordinatesOverlay = ({
  location,
  displayToast,
}: LocationCoordinatesOverlayProps) => {
  // Callbacks
  const coordinates = useCallback(() => formatCoordinates(
    location[1],
    location[0],
    getStringForKey(COORDINATES_FORMAT_KEY),
  ), [location]);

  // Handlers
  const onCoordinatesTap = () => {
    Clipboard.setString(coordinates());
    displayToast(true);
  };

  return (
    <TouchableOpacity
      onPress={onCoordinatesTap}
      style={[styles.coordinatesOverlay, { top: getTopAreaInsets() + 60 }]}
    >
      <Text caption black>
        {coordinates()}
      </Text>
    </TouchableOpacity>
  );
};

export { LocationCoordinatesOverlay };
