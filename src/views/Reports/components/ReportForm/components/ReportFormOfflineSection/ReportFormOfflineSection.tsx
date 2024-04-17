// External Dependencies
import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { Position } from '../../../../../../common/types/types';
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { COORDINATES_FORMAT_KEY, IS_ANDROID } from '../../../../../../common/constants/constants';
import { LocationOffAndroid } from '../../../../../../common/icons/LocationOffAndroid';
import { LocationOffForIosOffline } from '../../../../../../common/icons/LocationOffForIosOffline';
import { LocationFormats, formatCoordinates } from '../../../../../../common/utils/locationUtils';
import { getStringForKey } from '../../../../../../common/data/storage/keyValue';

// Styles
import styles from './ReportFormOfflineSection.styles';

// Interfaces
interface OfflineSectionProps {
  reportCoordinates: Position;
  enableLocationIcon: boolean;
  onFieldPress: () => void;
  onIconPress: () => void;
}

export const OfflineSection = ({
  reportCoordinates,
  enableLocationIcon,
  onFieldPress,
  onIconPress,
}: OfflineSectionProps) => {
  // Hooks
  const { t } = useTranslation();

  // Constants
  const coordinatesFormat = getStringForKey(COORDINATES_FORMAT_KEY);

  return (
    <View style={styles.horizontalContainer}>
      <Pressable
        disabled={coordinatesFormat !== LocationFormats.DEG}
        style={styles.inputContainer}
        onPress={() => onFieldPress()}
      >
        <View>
          <Text style={styles.title}>{t('reports.offlineReportLocation')}</Text>
          <Text style={styles.textInput}>{`${formatCoordinates(reportCoordinates[1] || 0, reportCoordinates[0] || 0, coordinatesFormat)}`}</Text>
          <View style={styles.line} />
        </View>
      </Pressable>
      <Pressable
        onPress={() => onIconPress()}
      >
        <View style={styles.icon}>
          {IS_ANDROID
            ? (
              <LocationOffAndroid
                color={
                enableLocationIcon
                  ? COLORS_LIGHT.G3_secondaryMediumLightGray
                  : COLORS_LIGHT.G4_secondaryLightGray
                }
              />
            ) : (
              <LocationOffForIosOffline
                color={
                enableLocationIcon
                  ? COLORS_LIGHT.G3_secondaryMediumLightGray
                  : COLORS_LIGHT.G4_secondaryLightGray
                }
              />
            )}
        </View>
      </Pressable>
    </View>
  );
};
