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
  Incubator,
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
import { Pressable, useWindowDimensions } from 'react-native';
import Clipboard from '@react-native-community/clipboard';

// Internal Dependencies
import { useRetrievePatrolDetailsByPatrolId } from '../../../../common/data/patrols/useRetrievePatrolDetailsByPatrolId';
import { StopIcon } from '../../../../common/icons/StopIcon';
import { PatrolDetail } from '../../../../common/types/types';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { cleanUpSvg } from '../../../../common/utils/svgIconsUtils';
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
  PATROL_DISTANCE,
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
import { CopyIcon } from '../../../../common/icons/CopyIcon';
import { DistanceIcon } from '../../../../common/icons/DistanceIcon';
import { DurationIcon } from '../../../../common/icons/DurationIcon';
import { getTimeDiff } from '../../../../common/utils/timeUtils';

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
  const [displayCoordinatesCopied, setDisplayCoordinatesCopied] = useState(false);

  const getIsMinimized = () => getNumberForKey(BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX) === 0;

  // References
  const eventEmitter = useRef(getEventEmitter()).current;

  // Component's State
  const [patrolDetails, setPatrolDetails] = useState<PatrolDetail | null>(null);
  const [coordinatesFormat, setCoordinatesFormat] = useState(
    getStringForKey(COORDINATES_FORMAT_KEY) || LocationFormats.DEG,
  );
  const [initialCoordinates, setInitialCoordinates] = useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMinimized, setIsMinimized] = useState(getIsMinimized());
  const [patrolDuration, setPatrolDuration] = useState('');

  useEffect(() => {
    setPatrolDuration(getDuration());
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
    const coordinates = formatCoordinates(
      patrolDetails?.startLatitude || 0,
      patrolDetails?.startLongitude || 0,
      getStringForKey(COORDINATES_FORMAT_KEY) || LocationFormats.DDM,
    );

    setInitialCoordinates(coordinates);
  });

  const updatePatrolData = async () => {
    const patrol = await retrievePatrolDetailsByPatrolId((patrolId || '').toString());
    if (patrol) {
      setPatrolDetails(mapToPatrolDetail(patrol));
    }
  };

  const onCoordinatesCopyTap = () => {
    Clipboard.setString(
      formatCoordinates(
        patrolDetails?.startLatitude || 0,
        patrolDetails?.startLongitude || 0,
        coordinatesFormat,
      ),
    );

    setDisplayCoordinatesCopied(true);
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

  // Utilities

  const getDuration = () => {
    if (patrolDetails) {
      const { days, hours, mins } = getTimeDiff(patrolDetails.createdAt);

      if (days > 0) {
        return `${days}d ${hours}h`;
      }

      return `${hours}h ${mins}m`;
    }

    return '';
  };

  return (
    <>
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

        {/* Start Time */}
        <Text
          mobileBody
          secondaryMediumGray
          style={styles.dateText}
        >
          {`${t('patrolDetails.started')} ${patrolDetails?.startTimeFormatted || ''} ${patrolDetails?.serialNumber ? `· #${patrolDetails?.serialNumber}` : ''}`}
        </Text>
        {/* End Start Time */}

        <View style={styles.detailCardsContainer}>
          {/* Distance */}
          <View style={styles.cardContainer}>
            <Text label secondaryMediumGray>{t('patrolDetails.distance')}</Text>
            <View style={styles.cardContent}>
              <DistanceIcon />
              <Text heading2 marginL-8>
                {getNumberForKey(PATROL_DISTANCE) !== undefined
                  ? `${getNumberForKey(PATROL_DISTANCE)!.toFixed(1)} km`
                  : 0}
              </Text>
            </View>
          </View>
          {/* End Distance */}

          {/* Duration */}
          <View style={styles.cardContainer}>
            <Text label secondaryMediumGray>{t('patrolDetails.duration')}</Text>
            <View style={styles.cardContent}>
              <DurationIcon />
              <Text heading2 marginL-8>{patrolDuration}</Text>
            </View>
          </View>
          {/* End Duration */}
        </View>

        <View style={styles.detailCardsContainer}>
          {/* Start Location */}
          <View>
            <Text label secondaryMediumGray marginL-8>{t('patrolDetails.startLocation')}</Text>
            <View style={styles.locationContainer}>
              {coordinatesFormat === 'DMS' ? (
                <View style={{ flexDirection: 'column' }}>
                  <Text bodySmall black marginL-8>
                    {initialCoordinates?.split(',')[0].trim()}
                  </Text>
                  <Text bodySmall black marginL-8>
                    {initialCoordinates?.split(',')[1].trim()}
                  </Text>
                </View>
              ) : (
                <Text bodySmall black marginL-8>
                  {initialCoordinates}
                </Text>
              )}
              <View style={styles.iconStatusContainer}>
                <Pressable onPress={onCoordinatesCopyTap}>
                  <CopyIcon />
                </Pressable>
              </View>
            </View>
          </View>
          {/* End Start Location */}

          {/* End Button */}
          <Button style={styles.endPatrolButtonMP} onPress={onPatrolStop}>
            <Image source={stopIcon} />
            <Text heading3 brightRed marginL-10>{t('common.end')}</Text>
          </Button>
          {/* End Button */}
        </View>
      </View>

      {/* Coordinates copied to clipboard Toast */}
      <Incubator.Toast
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        message={t('mapTrackLocation.coordinatesCopied')}
        messageStyle={{ color: COLORS_LIGHT.white, marginLeft: -24 }}
        onDismiss={() => setDisplayCoordinatesCopied(false)}
        position="bottom"
        style={{ borderRadius: 4 }}
        visible={displayCoordinatesCopied}
      />
      {/* End Coordinates copied to clipboard Toast */}
    </>
  );
};

export { PatrolDetailsView };
