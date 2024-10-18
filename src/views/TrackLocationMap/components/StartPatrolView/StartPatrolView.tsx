// External Dependencies
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import {
  RouteProp, useFocusEffect, useNavigation, useRoute,
} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import dayjs from 'dayjs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Internal Dependencies
import { LocationSmallGray } from '../../../../common/icons/LocationSmallGray';
import { FormTextField } from '../../../Reports/jsonforms/controls/components/FormTextField/FormTextField';
import {
  ALERT_BUTTON_BACKGROUND_COLOR_BLUE,
  DATE_FORMAT_HHMM_DD_MMM_YYYY,
  LAST_SYNC_PATROLS_TIME_KEY,
  PATROL_TYPE,
  PATROL_TYPE_DISPLAY,
  START_PATROL_EVENT,
  COORDINATES_FORMAT_KEY,
  TRACKED_BY_SUBJECT_NAME_KEY,
  ACTIVE_USER_NAME_KEY,
  EXPERIMENTAL_FEATURES_FLAG_KEY, PATROL_INFO_EVENT_TYPE_VALUE, PATROL_INFO_ENABLED,
} from '../../../../common/constants/constants';
import { LocationLiveStateIcon } from '../../../../common/icons/LocationLiveStateIcon';
import { LocationOnStateIcon } from '../../../../common/icons/LocationOnStateIcon';
import { COLORS_LIGHT } from '../../../../common/constants/colors';
import { getEventEmitter } from '../../../../common/utils/AppEventEmitter';
import { PatrolStartIcon } from '../../../../common/icons/PatrolStartIcon';
import { CustomAlert } from '../../../../common/components/CustomAlert/CustomAlert';
import { getSecuredStringForKey } from '../../../../common/data/storage/utils';
import { CloseIcon } from '../../../../common/icons/CloseIcon';
import { customBackButton } from '../../../../common/components/header/header';
import { Patrol, Position, RootStackParamList } from '../../../../common/types/types';
import {
  setStringForKey,
  getStringForKey,
  getBoolForKey,
} from '../../../../common/data/storage/keyValue';
import BackgroundLocation from '../../../../common/backgrounGeolocation/BackgroundLocation';
import log from '../../../../common/utils/logUtils';
import { ApiStatus } from '../../../../common/types/apiModels';
import { PatrolStatus } from '../../../../common/utils/patrolsUtils';
import { usePopulatePatrolStart } from '../../../../common/data/patrols/usePopulatePatrolStart';
import { useUploadPatrols } from '../../../../common/data/patrols/useUploadPatrols';
import { getSession } from '../../../../common/data/storage/session';
import { useUpdatePatrolState } from '../../../../common/data/patrols/useUpdatePatrolState';
import { PatrolResult } from '../../../../common/enums/enums';
import { Loader } from '../../../../common/components/Loader/Loader';
import { LocationFormats, formatCoordinates, isNullIslandPosition } from '../../../../common/utils/locationUtils';
import { useRetrieveReportTypes } from '../../../../common/data/reports/useRetrieveReportTypes';

// Styles
import styles from './StartPatrolView.styles';

// Types
type RouteParams = {
  patrolTitle: string;
  patrolType: string;
  patrolTypeId: string;
  coordinates: Position;
};

const StartPatrolView = () => {
  // Hooks
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'StartPatrolView'>>();
  const { t } = useTranslation();
  const { populatePatrolStart } = usePopulatePatrolStart();
  const { startPatrol } = useUploadPatrols();
  const { updatePatrolState } = useUpdatePatrolState();
  const { retrieveDefaultEventTypeByValue } = useRetrieveReportTypes();

  // Component's State
  const [isTrackedByFocused, setIsTrackedByFocused] = useState(false);
  const [isPatrolTitleFocused, setIsPatrolTitleFocused] = useState(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [patrolCustomTitle, setPatrolCustomTitle] = useState('');
  const [showConfirmationStartPatrol, setShowConfirmationStartPatrol] = useState(false);
  const [showUnauthorizedPatrolAlert, setShowUnauthorizedPatrolAlert] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [coordinatesFormat] = useState(
    getStringForKey(COORDINATES_FORMAT_KEY) || LocationFormats.DEG,
  );
  const [trackedBy, setTrackedBy] = useState(
    getStringForKey(TRACKED_BY_SUBJECT_NAME_KEY) || getSecuredStringForKey(ACTIVE_USER_NAME_KEY),
  );

  // Constants
  const VIEW_NAME = 'StartPatrolView';
  const headerLeft = () => customBackButton(
    <CloseIcon />,
    () => setShowConfirmationStartPatrol(true),
    true,
  );

  // Component's References
  const eventEmitter = useRef(getEventEmitter()).current;

  // Get route parameters
  const {
    patrolTitle,
    patrolType,
    patrolTypeId,
    coordinates,
  }: RouteParams = route.params;

  // Component's life-cycle events
  useEffect(() => {
    // Set view title
    navigation.setOptions({
      headerLeft,
      title: patrolTitle,
    });

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

  useFocusEffect(() => {
    setTrackedBy(
      getStringForKey(TRACKED_BY_SUBJECT_NAME_KEY) || getSecuredStringForKey(ACTIVE_USER_NAME_KEY),
    );
  });

  // Handlers
  const onPatrolStartPressHandler = async () => {
    setIsLoaderVisible(true);
    setStringForKey(PATROL_TYPE, patrolType);
    setStringForKey(PATROL_TYPE_DISPLAY, patrolCustomTitle || patrolTitle);

    let status: PatrolResult;
    let location: number[] | null = coordinates;

    if (isNullIslandPosition(coordinates)) {
      location = await getLocation();
    }

    const timestamp = dayjs().format();

    // Persist patrol information to local database
    const patrolId = await populatePatrolStart(
      patrolTypeId,
      location ? location[1].toString() : null,
      location ? location[0].toString() : null,
      timestamp,
    );

    if (isDeviceOnline && patrolId) {
      try {
        const accessToken = getSession()?.access_token || '';
        const apiStatus = await startPatrol(patrolId.toString(), accessToken);
        if (apiStatus === ApiStatus.Forbidden) {
          setIsLoaderVisible(false);
          status = PatrolResult.unauthorized;
          await updatePatrolState(patrolId.toString(), PatrolStatus.Unauthorized);
          setShowUnauthorizedPatrolAlert(true);
        } else {
          status = PatrolResult.succeeded;
          log.info(`${VIEW_NAME} :: Active patrol uploaded`);
          setStringForKey(LAST_SYNC_PATROLS_TIME_KEY, dayjs().format(DATE_FORMAT_HHMM_DD_MMM_YYYY));
        }
      } catch (uploadActivePatrolError: any) {
        status = PatrolResult.error;
        log.info(`${VIEW_NAME} :: Active patrol upload failed`);
      }
    } else {
      status = PatrolResult.noInternet;
    }

    setIsLoaderVisible(false);

    eventEmitter.emit(START_PATROL_EVENT, {
      patrol: {
        id: patrolId,
        typeId: patrolTypeId,
        type: patrolType,
        display: patrolCustomTitle || patrolTitle,
        coordinates: location,
        timestamp,
        status,
      } as Patrol,
    });

    if (status !== PatrolResult.unauthorized) {
      if (getBoolForKey(PATROL_INFO_ENABLED)) {
        await openPatrolInfoEventForm(timestamp);
      } else {
        navigation.popToTop();
      }
    }
  };

  const openPatrolInfoEventForm = async (timestamp: string) => {
    const defaultEventTypeValue = getStringForKey(PATROL_INFO_EVENT_TYPE_VALUE) || '';
    const defaultEventType = await retrieveDefaultEventTypeByValue(defaultEventTypeValue);

    if (defaultEventType) {
      navigation.navigate('ReportForm', {
        title: defaultEventType.display,
        typeId: defaultEventType.id,
        coordinates,
        schema: defaultEventType.schema,
        geometryType: defaultEventType.geometry_type,
        createdAt: timestamp,
        isDefaultPatrolInfoEnabled: true,
      });
    } else {
      navigation.popToTop();
    }
  };

  const getLocation = async () => {
    let location = null;
    try {
      // Wait for tracking to get an actual location.
      // This prevents having 0,0 in the database as starting point.
      location = await BackgroundLocation.getCurrentPosition({
        samples: 1,
        persist: true,
      });

      log.debug(`Patrol will start with this location: ${location.coords.latitude}, ${location.coords.longitude}`);
    } catch (error: any) {
      log.debug(`Could not get current location: ${error}`);
    }

    const position: Position | null = location
      ? [location.coords.latitude, location.coords.latitude]
      : null;

    if (position && isNullIslandPosition(position)) {
      return null;
    }

    return position || null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Start Location Information */}
      <View style={styles.startLocationContainer}>
        {/* Start Location */}
        <View style={styles.startLocationTitleContainer}>
          <LocationSmallGray width="12" height="12" />
          <Text label style={styles.startLocationTitle}>{t('mapTrackLocation.startLocation')}</Text>
        </View>
        {/* End Start Location */}

        {/* Coordinates */}
        <View>
          <Text heading2>
            {`${formatCoordinates(coordinates[1] || 0, coordinates[0] || 0, coordinatesFormat)}`}
          </Text>
        </View>
        {/* End Coordinates */}

        {/* Internet Status Icon */}
        <View style={styles.startLocationConnectivityContainer}>
          {isDeviceOnline ? (
            <LocationLiveStateIcon width="30" height="20" />
          ) : (
            <LocationOnStateIcon width="30" height="20" />
          )}
        </View>
        {/* End Internet Status Icon */}
      </View>
      {/* End Start Location Information */}

      {/* Tracked By */}
      <View>
        <FormTextField
          placeholder={t('settingsView.trackedBy')}
          isFocused={isTrackedByFocused}
          onChangeText={() => null}
          value={trackedBy}
          onFocus={() => setIsTrackedByFocused(true)}
          onBlur={() => setIsTrackedByFocused(false)}
          editable={false}
          onPressIn={() => {
            if (getBoolForKey(EXPERIMENTAL_FEATURES_FLAG_KEY)) {
              navigation.navigate('SubjectsView', {});
            }
          }}
        />
      </View>
      {/* End Tracked By */}

      {/* Patrol Title */}
      <View style={styles.patrolCustomTitle}>
        <FormTextField
          placeholder={t('startPatrolView.patrolTitle')}
          isFocused={isPatrolTitleFocused}
          onChangeText={(e) => {
            setPatrolCustomTitle(e.trim().length > 0 ? e : '');
          }}
          value={patrolCustomTitle}
          onFocus={() => setIsPatrolTitleFocused(true)}
          onBlur={() => setIsPatrolTitleFocused(false)}
        />
      </View>
      {/* End Patrol Title */}

      {/* Start Patrol Button */}
      <Button
        backgroundColor={COLORS_LIGHT.brightBlue}
        size={Button.sizes.large}
        // eslint-disable-next-line react/no-unstable-nested-components
        iconSource={() => <View style={{ marginRight: 8 }}><PatrolStartIcon /></View>}
        style={styles.startPatrolButton}
        label={t('mapTrackLocation.startPatrol')}
        heading3
        onPress={onPatrolStartPressHandler}
        disabled={isLoaderVisible}
      />
      {/* End Start Patrol Button */}

      {/* Alert - Dismiss Start Patrol */}
      <CustomAlert
        displayAlert={showConfirmationStartPatrol}
        alertTitleText={t('startPatrolView.discardTitle')}
        positiveButtonText={t('startPatrolView.discardAction')}
        negativeButtonText={t('common.cancel')}
        onPositiveButtonPress={() => {
          setShowConfirmationStartPatrol(false);

          // @ts-ignore
          navigation.popToTop();
        }}
        onNegativeButtonPress={() => {
          setShowConfirmationStartPatrol(false);
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />
      {/* End Alert - Dismiss Start Patrol */}
      {/* Alert - Unauthorized patrol */}
      <CustomAlert
        displayAlert={showUnauthorizedPatrolAlert}
        alertMessageText={t('mapTrackLocation.unauthorizedPatrolDialog.message')}
        positiveButtonText={t('mapTrackLocation.unauthorizedPatrolDialog.action')}
        onPositiveButtonPress={() => {
          setShowUnauthorizedPatrolAlert(false);
          // @ts-ignore
          navigation.popToTop();
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />
      {/* End Alert - Unauthorized patrol */}
      <Loader isVisible={isLoaderVisible} />
    </SafeAreaView>
  );
};

export { StartPatrolView };
