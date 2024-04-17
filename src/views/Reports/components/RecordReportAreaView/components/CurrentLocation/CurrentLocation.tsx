// External Dependencies
import React from 'react';
import { Colors, Text, View } from 'react-native-ui-lib';

// Internal Dependencies
import { Position } from '../../../../../../common/types/types';
import { getStringForKey } from '../../../../../../common/data/storage/keyValue';
import { COORDINATES_FORMAT_KEY } from '../../../../../../common/constants/constants';
import { formatCoordinates } from '../../../../../../common/utils/locationUtils';

// Styles
import styles from './CurrentLocation.styles';

// Interfaces
interface CurrentLocationProps {
  coordinates: Position
}

const CurrentLocation = ({
  coordinates,
}: CurrentLocationProps) => {
  // Constants
  const coordinatesFormat = getStringForKey(COORDINATES_FORMAT_KEY);

  return (
    <View style={styles.currentLocationContainer}>
      <Text
        bodySmall
        centeredText
        color={Colors.black}
      >
        {`${formatCoordinates(coordinates[1] || 0, coordinates[0] || 0, coordinatesFormat)}`}
      </Text>
    </View>
  );
};

export { CurrentLocation };
