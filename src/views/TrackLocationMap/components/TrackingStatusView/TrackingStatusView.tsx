/* eslint-disable import/no-cycle */
// External Dependencies
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Image,
  Text,
  View,
} from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import Animated, {
  Extrapolation, interpolate, useAnimatedStyle,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Internal Dependencies
import { useMMKVBoolean, useMMKVNumber } from 'react-native-mmkv';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { LocationOnForIos } from '../../../../common/icons/LocationOnForIos';
import { ChevronIcon } from '../../../../common/icons/ChevronIcon';
import { StopTrackingIcon } from '../../../../common/icons/StopTrackingIcon';
import {
  ACTIVE_USER_HAS_PATROLS_PERMISSION,
  BOTTOM_SHEET_NAVIGATOR,
  BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX,
} from '../../../../common/constants/constants';
import { BottomSheetAction, BottomSheetComponentAction } from '../../../../common/enums/enums';
import { getEventEmitter } from '../../../../common/utils/AppEventEmitter';
import { useBottomSheetContext } from '../BottomSheetNavigator/BottomSheetNavigator';
import {
  BOTTOM_TAB_BAR_HEIGHT,
  TRACKING_STATUS_INLINE_BUTTONS_HEIGHT,
  TRACKING_STATUS_STACKED_BUTTONS_HEIGHT,
  TRACKING_STATUS_TITLE_HEIGHT,
} from '../../../../common/constants/dimens';
import { getBoolForKey, getNumberForKey, localStorage } from '../../../../common/data/storage/keyValue';
import { StartPatrolIcon } from '../../../../common/icons/StartPatrolIcon';

// Styles
import { styles } from './TrackingStatusView.styles';

export const TrackingStatusView = () => {
  // Hooks
  const { t } = useTranslation();
  const { animatedPosition } = useBottomSheetContext();
  const { height: windowHeight } = useWindowDimensions();
  const [bottomSheetIndex] = useMMKVNumber(BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX, localStorage);
  const [isPatrolPermissionStatus] = useMMKVBoolean(
    ACTIVE_USER_HAS_PATROLS_PERMISSION,
    localStorage,
  );

  const getIsMinimized = () => getNumberForKey(BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX) === 0;

  // State
  const [isMinimized, setIsMinimized] = useState(getIsMinimized());
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [isPatrolPermissionAvailable, setIsPatrolPermissionAvailable] = useState(true);

  // References
  const eventEmitter = useRef(getEventEmitter()).current;

  // Constants
  const stackedLanguages = ['es', 'fr', 'sw', 'pt'];
  const isButtonStacked = stackedLanguages.includes(getLocales()[0].languageCode);

  // Icons
  const chevronIcon = () => <ChevronIcon />;
  const stopTrackingIcon = () => <StopTrackingIcon />;
  const pinStartPatrol = () => <StartPatrolIcon />;

  useEffect(() => {
    setIsMinimized(getIsMinimized());
  }, [bottomSheetIndex]);

  useEffect(() => {
    setIsPatrolPermissionAvailable(getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION));
  }, [isPatrolPermissionStatus]);

  useEffect(() => {
    // Listen for internet connection status
    const internetStatusListener = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable !== null) {
        setIsDeviceOnline(state.isInternetReachable);
      }
    });

    return () => {
      internetStatusListener();
    };
  }, []);

  const textAnimatedStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(
      animatedPosition.value,
      [isButtonStacked
        ? windowHeight - BOTTOM_TAB_BAR_HEIGHT - TRACKING_STATUS_STACKED_BUTTONS_HEIGHT
        : windowHeight - BOTTOM_TAB_BAR_HEIGHT - TRACKING_STATUS_INLINE_BUTTONS_HEIGHT,
      windowHeight - BOTTOM_TAB_BAR_HEIGHT - TRACKING_STATUS_TITLE_HEIGHT],
      [25, 17],
      Extrapolation.CLAMP,
    ),
    marginTop: interpolate(
      animatedPosition.value,
      [isButtonStacked
        ? windowHeight - BOTTOM_TAB_BAR_HEIGHT - TRACKING_STATUS_STACKED_BUTTONS_HEIGHT
        : windowHeight - BOTTOM_TAB_BAR_HEIGHT - TRACKING_STATUS_INLINE_BUTTONS_HEIGHT,
      windowHeight - BOTTOM_TAB_BAR_HEIGHT - TRACKING_STATUS_TITLE_HEIGHT],
      [4, 10],
      Extrapolation.CLAMP,
    ),
  }), []);

  const onEndTracking = () => {
    eventEmitter.emit(
      BOTTOM_SHEET_NAVIGATOR,
      { bottomSheetComponentAction: BottomSheetComponentAction.stopTracking },
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Icon */}
        <View style={styles.headerIcon}>
          <LocationOnForIos color={COLORS_LIGHT.brightBlue} />
        </View>

        {/* Title */}
        <Animated.Text
          ellipsizeMode="tail"
          style={[styles.headerTitle, textAnimatedStyle]}
        >
          {`${t('mapTrackLocation.tracking')} `}
          {isDeviceOnline ? t('mapTrackLocation.live') : t('mapTrackLocation.on')}
        </Animated.Text>

        {/* Button or Chevron */}
        {isMinimized ? (
          <Button
            onPress={() => onEndTracking()}
            style={styles.headerStopTrackingButton}
          >
            <Image source={stopTrackingIcon} />
            <Text
              brightRed
              heading3
              marginL-8
            >
              {t('common.end')}
            </Text>
          </Button>
        ) : (
          <Button
            iconSource={chevronIcon}
            style={styles.headerChevronIcon}
            onPress={() => eventEmitter.emit(
              BOTTOM_SHEET_NAVIGATOR,
              { bottomSheetAction: BottomSheetAction.snapToIndex, index: 0 },
            )}
            hitSlop={{
              top: 20, bottom: 20, left: 20, right: 20,
            }}
          />
        )}
        {/* End Button or Chevron */}
      </View>
      {/* End Header */}

      {/* Body */}
      <View
        style={
            [
              styles.bodyContainer,
              isButtonStacked ? styles.bodyContainerStacked : null,
            ]
          }
      >
        {isPatrolPermissionAvailable && (
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => eventEmitter.emit(
              BOTTOM_SHEET_NAVIGATOR,
              { bottomSheetComponentAction: BottomSheetComponentAction.startPatrol },
            )}
            style={
                [
                  styles.startButton,
                  isButtonStacked ? null : styles.buttonInlineLeft,
                ]
              }
          >
            <Image source={pinStartPatrol} />
            <Text
              heading3
              marginL-8
              white
            >
              {t('mapTrackLocation.startPatrol')}
            </Text>
          </Button>
        </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => onEndTracking()}
            style={
                [
                  styles.endButton,
                  isButtonStacked ? styles.buttonStacked : styles.buttonInlineRight,
                ]
              }
          >
            <Image source={stopTrackingIcon} />
            <Text
              brightRed
              heading3
              marginL-8
            >
              {t('trackingStatusView.endTracking')}
            </Text>
          </Button>
        </View>
      </View>
      {/* End Body */}
    </View>
  );
};
