// External Dependencies
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

// Internal Dependencies
import { LocationGpsIcon } from '../../../../common/icons/LocationGpsIcon';

// Styles
import styles from './MissingGPS.styles';

export const MissingGPS = () => {
  // Hooks
  const { t } = useTranslation();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.messageContainer}>
        <Text style={styles.gpsText} allowFontScaling={false}>
          {t('mapTrackLocation.noGpsText')}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <LocationGpsIcon />
      </View>
    </View>
  );
};
