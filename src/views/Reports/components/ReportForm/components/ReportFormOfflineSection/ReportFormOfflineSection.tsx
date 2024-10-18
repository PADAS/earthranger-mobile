// External Dependencies
import React from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-ui-lib';
import { isEqual } from 'lodash-es';

// Internal Dependencies
import { Position } from '../../../../../../common/types/types';
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { COORDINATES_FORMAT_KEY, IS_ANDROID } from '../../../../../../common/constants/constants';
import { LocationOffAndroid } from '../../../../../../common/icons/LocationOffAndroid';
import { LocationOffForIosOffline } from '../../../../../../common/icons/LocationOffForIosOffline';
import { LocationFormats, formatCoordinates, isValidObservationAccuracy } from '../../../../../../common/utils/locationUtils';
import { getStringForKey } from '../../../../../../common/data/storage/keyValue';

// Styles
import styles from './ReportFormOfflineSection.styles';

// Interfaces
interface OfflineSectionProps {
  reportCoordinates: Position;
  enableLocationIcon: boolean;
  accuracy: number;
  onFieldPress: () => void;
  onIconPress: () => void;
}

export const OfflineSection = ({
  reportCoordinates,
  enableLocationIcon,
  accuracy,
  onFieldPress,
  onIconPress,
}: OfflineSectionProps) => {
  // Hooks
  const { t } = useTranslation();
  const isValidAccuracy = isValidObservationAccuracy(accuracy);
  const accuracyColor = isValidAccuracy ? COLORS_LIGHT.G2_secondaryMediumGray : COLORS_LIGHT.red;

  // Constants
  const coordinatesFormat = getStringForKey(COORDINATES_FORMAT_KEY);

  return (
    <View style={styles.horizontalContainer}>
      <Pressable
        disabled={coordinatesFormat !== LocationFormats.DEG || isEqual(accuracy, 0)}
        style={[styles.coordinatesContainer, {
          backgroundColor: isValidAccuracy ? COLORS_LIGHT.G7_veryLightGrey : `${COLORS_LIGHT.red}08`,
        }]}
        onPress={() => onFieldPress()}
      >
        <View>
          <Text
            style={styles.title}
            color={accuracyColor}
          >
            {t('reports.offlineReportLocation')}
          </Text>
          <Text
            style={styles.textInput}
            color={isValidAccuracy ? COLORS_LIGHT.G0_black : COLORS_LIGHT.red}
          >
            {`${formatCoordinates(reportCoordinates[1] || 0, reportCoordinates[0] || 0, coordinatesFormat)}`}
          </Text>
          <View
            style={[styles.line, {
              backgroundColor: isValidAccuracy ? COLORS_LIGHT.G5_LightGreyLines : COLORS_LIGHT.red,
            }]}
          />
          <View style={{ backgroundColor: COLORS_LIGHT.white, paddingBottom: 16 }}>
            {(!isEqual(accuracy, 0)) && (
            <Text
              style={styles.title}
              color={accuracyColor}
            >
              {`${isValidAccuracy ? t('reports.accuracy') : t('reports.lowAccuracy')}: ${Math.trunc(accuracy)}m`}
            </Text>
            )}
          </View>
        </View>
      </Pressable>
      {(!isEqual(accuracy, 0)) && (
      <Pressable
        onPress={() => onIconPress()}
        disabled={!enableLocationIcon}
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
      )}
    </View>
  );
};
