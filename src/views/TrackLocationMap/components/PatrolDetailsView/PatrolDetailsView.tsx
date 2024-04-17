/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-cycle */
// External Dependencies
import React, {
  useEffect, useRef,
  useState,
} from 'react';
import {
  Button,
  Image,
  Text,
  View,
} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useMMKVBoolean, useMMKVNumber } from 'react-native-mmkv';
import { useWindowDimensions } from 'react-native';

// Internal Dependencies
import { useRetrievePatrolDetailsByPatrolId } from '../../../../common/data/patrols/useRetrievePatrolDetailsByPatrolId';
import { StopIcon } from '../../../../common/icons/StopIcon';
import { LocationSmallGray } from '../../../../common/icons/LocationSmallGray';
import { ReportsSyncRequiredIcon } from '../../../../common/icons/ReportsSyncRequiredIcon';
import { PatrolDetail } from '../../../../common/types/types';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { cleanUpSvg } from '../../../../common/utils/svgIconsUtils';
import { ReportsSyncNotRequiredIcon } from '../../../../common/icons/ReportsSyncNotRequiredIcon';
import { mapToPatrolDetail } from '../../../../common/types/typeMapper';
import {
  getNumberForKey,
  getStringForKey,
  localStorage,
} from '../../../../common/data/storage/keyValue';
import {
  ACTIVE_PATROL_ID_KEY,
  BOTTOM_SHEET_NAVIGATOR,
  BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX,
  COORDINATES_FORMAT_KEY,
  PATROLS_SYNCING,
} from '../../../../common/constants/constants';
import { LocationFormats, formatCoordinates } from '../../../../common/utils/locationUtils';
import { DefaultEventTypeIcon } from '../../../../common/icons/DefaultEventTypeIcon';
import { ChevronIcon } from '../../../../common/icons/ChevronIcon';
import { fontWeight } from '../../../../common/constants/fonts';
import { getEventEmitter } from '../../../../common/utils/AppEventEmitter';
import { BottomSheetAction, BottomSheetComponentAction } from '../../../../common/enums/enums';
import { useBottomSheetContext } from '../BottomSheetNavigator/BottomSheetNavigator';
import {
  BOTTOM_TAB_BAR_HEIGHT,
  PATROL_DETAILS_CONTENT_HEIGHT,
  PATROL_DETAILS_TITLE_HEIGHT,
} from '../../../../common/constants/dimens';

// Styles
import { styles } from './PatrolDetailsView.styles';

const PatrolDetailsView = () => {
  // Hooks
  const { retrievePatrolDetailsByPatrolId } = useRetrievePatrolDetailsByPatrolId();
  const { t } = useTranslation();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [isSyncingPatrols] = useMMKVBoolean(
    PATROLS_SYNCING,
    localStorage,
  );
  const { animatedPosition } = useBottomSheetContext();
  const [patrolId] = useMMKVNumber(ACTIVE_PATROL_ID_KEY, localStorage);
  const [bottomSheetIndex] = useMMKVNumber(BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX, localStorage);

  const getIsMinimized = () => getNumberForKey(BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX) === 0;

  // References
  const eventEmitter = useRef(getEventEmitter()).current;

  // Component's State
  const [patrolDetails, setPatrolDetails] = useState<PatrolDetail | null>(null);
  const [coordinatesFormat, setCoordinatesFormat] = useState(
    getStringForKey(COORDINATES_FORMAT_KEY) || LocationFormats.DEG,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMinimized, setIsMinimized] = useState(getIsMinimized());

  useEffect(() => {
    setIsMinimized(getIsMinimized());
  }, [bottomSheetIndex]);

  useEffect(() => {
    const updatePatrolDataAsync = async () => {
      await updatePatrolData();
    };

    if (patrolId) {
      updatePatrolDataAsync();
    }
  }, [patrolId, isSyncingPatrols]);

  useFocusEffect(() => {
    setCoordinatesFormat(getStringForKey(COORDINATES_FORMAT_KEY) || LocationFormats.DDM);
  });

  const updatePatrolData = async () => {
    const patrol = await retrievePatrolDetailsByPatrolId((patrolId || '').toString());
    if (patrol) {
      setPatrolDetails(mapToPatrolDetail(patrol));
    }
  };

  const onPatrolStop = () => {
    eventEmitter.emit(
      BOTTOM_SHEET_NAVIGATOR,
      { bottomSheetComponentAction: BottomSheetComponentAction.stopPatrol },
    );
  };

  const stopIcon = () => <StopIcon />;
  const chevronIcon = () => <ChevronIcon />;

  const textReanimatedStyle = useAnimatedStyle(() => ({
    fontWeight: fontWeight.semiBold,
    color: COLORS_LIGHT.G0_black,
    fontSize: interpolate(
      animatedPosition.value,
      [windowHeight - BOTTOM_TAB_BAR_HEIGHT - PATROL_DETAILS_CONTENT_HEIGHT,
        windowHeight - BOTTOM_TAB_BAR_HEIGHT - PATROL_DETAILS_TITLE_HEIGHT],
      [25, 17],
      Extrapolation.CLAMP,
    ),
    marginTop: interpolate(
      animatedPosition.value,
      [windowHeight - BOTTOM_TAB_BAR_HEIGHT - PATROL_DETAILS_CONTENT_HEIGHT,
        windowHeight - BOTTOM_TAB_BAR_HEIGHT - PATROL_DETAILS_TITLE_HEIGHT],
      [12, 16],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      animatedPosition.value,
      [windowHeight - BOTTOM_TAB_BAR_HEIGHT - PATROL_DETAILS_CONTENT_HEIGHT,
        windowHeight - BOTTOM_TAB_BAR_HEIGHT - PATROL_DETAILS_TITLE_HEIGHT],
      [windowWidth * 0.7, windowWidth * 0.5],
      Extrapolation.CLAMP,
    ),
  }), []);

  return (
    <View style={styles.container}>
      { /* Header */ }
      <View style={styles.headerContainer}>
        {/* Patrol Icon */}
        { patrolDetails?.iconSVG
          ? (
            <SvgXml
              style={styles.patrolIcon}
              xml={cleanUpSvg(patrolDetails?.iconSVG)}
              width="26"
              height="26"
              fill={COLORS_LIGHT.brightBlue}
            />
          )
          : (
            <View
              style={styles.patrolIcon}
            >
              <DefaultEventTypeIcon width="26" height="26" color={COLORS_LIGHT.brightBlue} />
            </View>
          )}
        {/* End Patrol Icon */}

        {/* Patrol Title */}
        <Animated.Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.header, textReanimatedStyle]}
        >
          {patrolDetails?.title}
        </Animated.Text>
        {/* End Patrol Title */}

        {/* End Patrol Button or Chevron */}
        {isMinimized ? (
          <Button style={styles.headerEndPatrolButtonMP} onPress={onPatrolStop}>
            <Image source={stopIcon} />
            <Text heading3 brightRed marginL-10>{t('common.end')}</Text>
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
        {/* End Patrol Button or Chevron */}
      </View>
      { /* End Header */ }
      <Text
        mobileBody
        secondaryMediumGray
        style={styles.dateText}
      >
        {`${t('patrolDetails.started')} ${patrolDetails?.startTimeFormatted || ''} ${patrolDetails?.serialNumber ? `· #${patrolDetails?.serialNumber}` : ''}`}
      </Text>
      <View style={styles.locationCardContainer}>
        <View style={styles.startLocationContainer}>
          <LocationSmallGray width="12" height="12" />
          <Text label secondaryMediumGray marginL-4>{t('patrolDetails.startLocation')}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Text heading2 black>
            {`${formatCoordinates(patrolDetails?.startLatitude || 0, patrolDetails?.startLongitude || 0, coordinatesFormat)}`}
          </Text>
          <View style={styles.iconStatusContainer}>
            { patrolDetails?.remoteId
              ? <ReportsSyncNotRequiredIcon height="24" width="24" />
              : <ReportsSyncRequiredIcon height="24" width="24" />}
          </View>
        </View>
      </View>
      <Button style={styles.endPatrolButtonMP} onPress={onPatrolStop}>
        <Image source={stopIcon} />
        <Text heading3 brightRed marginL-10>{t('common.end')}</Text>
      </Button>

    </View>
  );
};

export { PatrolDetailsView };
