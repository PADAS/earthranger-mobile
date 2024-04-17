/* eslint-disable no-nested-ternary */
// External Dependencies
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  View,
} from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from '../../../../../../common/constants/colors';
import { LocationLiveStateIcon } from '../../../../../../common/icons/LocationLiveStateIcon';
import { LocationOnStateIcon } from '../../../../../../common/icons/LocationOnStateIcon';
import { getTopAreaInsets } from '../../../../../../common/utils/safeAreaInsets';
import { getBoolForKey } from '../../../../../../common/data/storage/keyValue';
import { ACTIVE_USER_HAS_PATROLS_PERMISSION } from '../../../../../../common/constants/constants';

// Styles
import styles from './TrackingOverlayButton.styles';

// Interfaces
interface TrackingOverlayButtonProps {
  isTrackingEnabled: boolean;
  isPatrolEnabled: boolean;
  isDeviceOnline: boolean;
}

export const TrackingOverlayButton = ({
  isTrackingEnabled,
  isPatrolEnabled,
  isDeviceOnline,
}: TrackingOverlayButtonProps) => {
  // Hooks
  const { t } = useTranslation();

  // Utility Functions
  const getTrackingStatusText = () => {
    if (isDeviceOnline) {
      return t('mapTrackLocation.live');
    }
    return t('mapTrackLocation.on');
  };

  const getButtonText = useCallback(() => {
    let buttonText = '';

    if (!isTrackingEnabled && !isPatrolEnabled) {
      if (!getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION)) {
        buttonText = `${t('mapTrackLocation.tracking')}`;
      } else {
        buttonText = `${t('mapTrackLocation.tracking')} / ${t('mapTrackLocation.patrol')}`;
      }
    } else if (isTrackingEnabled && !isPatrolEnabled) {
      buttonText = `${t('mapTrackLocation.tracking')} ${getTrackingStatusText()}`;
    } else {
      buttonText = `${t('mapTrackLocation.patrol')} ${getTrackingStatusText()}`;
    }

    return buttonText;
  }, [isTrackingEnabled, isPatrolEnabled, isDeviceOnline]);

  return (
    <View style={[styles.trackOverlayButton, { top: getTopAreaInsets() + 16 }]}>
      {!isTrackingEnabled ? (
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: isTrackingEnabled
                ? COLORS_LIGHT.green : COLORS_LIGHT.G4_secondaryLightGray,
            },
          ]}
        />
      ) : (
        <View style={styles.statusIconContainer}>
          { isDeviceOnline ? <LocationLiveStateIcon /> : <LocationOnStateIcon /> }
        </View>
      )}

      <Text style={styles.buttonTextContainer} allowFontScaling={false}>
        {getButtonText()}
      </Text>
    </View>
  );
};
