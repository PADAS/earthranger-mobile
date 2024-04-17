// External Dependencies
import React, { useRef } from 'react';
import {
  Button, Text, View,
} from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';

// Internal Dependencies
import { getEventEmitter } from '../../../../../../common/utils/AppEventEmitter';
import {
  ACTIVE_USER_HAS_PATROLS_PERMISSION,
  BOTTOM_SHEET_NAVIGATOR,
} from '../../../../../../common/constants/constants';
import { StartTrackingIcon } from '../../../../../../common/icons/StartTrackingIcon';
import { BottomSheetComponentAction, DeviceScreenWidth } from '../../../../../../common/enums/enums';
import { getBoolForKey } from '../../../../../../common/data/storage/keyValue';
import { StartPatrolIcon } from '../../../../../../common/icons/StartPatrolIcon';

// Styles
import styles from './PatrolTrack.styles';

const BottomSheetMainView = () => {
  // Hooks
  const { t } = useTranslation();

  // References
  const eventEmitter = useRef(getEventEmitter()).current;

  // Constants
  const { width } = Dimensions.get('window');
  const isSmallScreen = width <= DeviceScreenWidth.small;
  const isLongTextButton = t('mapTrackLocation.patrol').length >= 10 || t('mapTrackLocation.tracking').length >= 10;
  const flexDirection = (isSmallScreen && isLongTextButton) ? 'column' : 'row';

  const onPatrolStart = () => {
    eventEmitter.emit(
      BOTTOM_SHEET_NAVIGATOR,
      { bottomSheetComponentAction: BottomSheetComponentAction.startPatrol },
    );
  };

  const onStartTracking = () => {
    eventEmitter.emit(
      BOTTOM_SHEET_NAVIGATOR,
      { bottomSheetComponentAction: BottomSheetComponentAction.startTracking },
    );
  };

  return (
    <View style={[styles.container, { flexDirection }]}>
      {getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION) && (
      <Button style={[styles.patrolButton, flexDirection === 'column' ? styles.patrolButtonColumn : styles.patrolButtonRow]} onPress={onPatrolStart}>
        <StartPatrolIcon />
        <Text heading3 white marginL-8>{t('mapTrackLocation.patrol')}</Text>
      </Button>
      )}
      <Button style={[styles.trackButton, flexDirection === 'column' ? styles.trackButtonColumn : styles.trackButtonRow]} onPress={onStartTracking}>
        <StartTrackingIcon />
        <Text heading3 brightBlue marginL-8>{t('mapTrackLocation.tracking')}</Text>
      </Button>
    </View>
  );
};

export { BottomSheetMainView };
