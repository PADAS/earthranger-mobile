/* eslint-disable arrow-body-style */
// External Dependencies
import Config from 'react-native-config';
import Mapbox, {
  Camera,
  Images,
  MapState,
  MapView,
  ShapeSource,
  SymbolLayer,
  UserLocation,
  UserTrackingMode,
  UserLocationRenderMode as UserLocationRenderModeType,
} from '@rnmapbox/maps';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  AppState, AppStateStatus, Pressable, StatusBar, StatusBarStyle, View,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  Feature, FeatureCollection, Geometry, GeoJsonProperties,
} from 'geojson';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Incubator } from 'react-native-ui-lib';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv';
import { isEqual, last } from 'lodash-es';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

// Note: Internal Dependencies section has different divisions in this file because of the
// large number of dependencies.
// Internal Dependencies
import BackgroundLocation, {
  HeartbeatEvent,
  HttpEvent,
  Location,
  ProviderChangeEvent,
} from '../../common/backgrounGeolocation/BackgroundLocation';
import {
  getBoolForKey,
  getNumberForKey,
  getStringForKey,
  localStorage,
  setBoolForKey,
  setNumberForKey,
  setStringForKey,
} from '../../common/data/storage/keyValue';
import { logEvent } from '../../analytics/wrapper/analyticsWrapper';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../analytics/model/analyticsEvent';
import {
  createLocationPermissionAllowedEvent,
  createLocationPermissionDeniedEvent,
  createStartTrackingLocationEvent,
  createStopTrackingLocationEvent,
} from '../../analytics/locationTrack/locationTrackAnalytics';
import { API_TRACK_OBSERVATIONS, getApiUrl, USER_AGENT_VALUE } from '../../api/EarthRangerService';
import { getSession } from '../../common/data/storage/session';
import {
  backgroundLocationConfig,
  getLocationTemplate,
} from '../../common/backgrounGeolocation/backgroundLocationConfig';
import { getNextTrackingMode, syncPendingObservations } from '../../common/utils/trackingUtils';
import {
  LastLocation,
  Patrol,
  PersistedPatrolType,
  PersistedUserProfile,
  Position,
  RootStackParamList,
} from '../../common/types/types';
import { Track } from '../models/Observation';
import { logTracking } from '../../common/utils/logUtils';
import { useRetrievePatrolTypes } from '../../common/data/patrols/useRetrievePatrolTypes';
import { getSecuredStringForKey, localStorageSecured } from '../../common/data/storage/utils';
import { usePopulatePatrolStop } from '../../common/data/patrols/usePopulatePatrolStop';
import { getEventEmitter } from '../../common/utils/AppEventEmitter';
import { createStartTrackingEvent } from '../../analytics/tracking/trackingAnalytics';
import { createStartPatrolEvent, createStopPatrolEvent } from '../../analytics/patrols/patrolsAnalytics';
import {
  BottomSheetAction, BottomSheetComponentAction, PatrolResult, UserType,
} from '../../common/enums/enums';
import { isSyncing } from '../../common/utils/syncUtils';
import { useRetrieveSubjectsGeoJson } from '../../common/data/subjects/useRetrieveSubjectsGeoJson';

// Common Components
import { CustomAlert } from '../../common/components/CustomAlert/CustomAlert';
import { AddEventButton } from '../../common/components/AddEventButton/AddEventButton';

// Common Constants
import {
  ACTIVE_PATROL_ID_KEY,
  ACTIVE_PATROL_KEY,
  ACTIVE_USER_HAS_PATROLS_PERMISSION,
  ALERT_BUTTON_BACKGROUND_COLOR_BLUE,
  BASEMAP_KEY,
  BOTTOM_SHEET_NAVIGATOR,
  CUSTOM_CENTER_COORDS_ENABLED,
  CUSTOM_CENTER_COORDS_LAT,
  CUSTOM_CENTER_COORDS_LON,
  DATE_FORMAT_HHMM_DD_MMM_YYYY,
  IS_ANDROID,
  IS_DEVICE_TRACKING,
  IS_IOS,
  LAST_SYNC_LOCATION_TIME_KEY,
  LAST_SYNC_PATROLS_TIME_KEY,
  LAST_SYNC_REPORTS_TIME_KEY,
  LOCATION_STATUS_KEY,
  MERGE_CATEGORIES_KEY,
  PATROL_DISTANCE,
  PATROL_START_LOCATION,
  PATROL_STATUS_KEY,
  PATROL_TYPE,
  PROMINENT_DISCLOSURE_KEY,
  REPORTS_SUBMITTED_KEY,
  SELECTED_SUBJECT_IN_MAP,
  SESSION_KEY,
  SHOW_USER_TRAILS_ENABLED_KEY,
  START_PATROL_EVENT,
  SYNC_TRACKS_MANUALLY,
  TRACKED_BY_SUBJECT_ID_KEY,
  UPDATE_PATROL_TYPES_UI,
  USER_REMOTE_ID_KEY,
} from '../../common/constants/constants';
import { COLORS_LIGHT } from '../../common/constants/colors';

// Internal Components
import { UserTrailsMapLayer } from './components/UserTrailsMapLayer/UserTrailsMapLayer';
import { UserTrailPointsMapLayer } from './components/UserTrailPointsMapLayer/UserTrailPointsMapLayer';
import { MissingGPS } from './components/MissingGPS/MissingGPS';
import { TrackingOverlay } from './components/TrackingOverlay/components/TrackingOverlay';
import {
  getCurrentPositionAsync,
  getMapUserPosition,
  isNullIslandPosition,
  isValidObservationAccuracy,
  isValidObservationThreshold,
  nullIslandLocation,
  requestMapLocationPermissions,
  setMapUserLocation,
} from '../../common/utils/locationUtils';
import { useUploadPatrols } from '../../common/data/patrols/useUploadPatrols';
import { useRefreshToken } from '../../common/utils/useRefreshToken';
import { isExpiredTokenStatus } from '../../common/utils/errorUtils';
import { ApiResponseCodes } from '../../common/types/apiModels';
import { getTopAreaInsets } from '../../common/utils/safeAreaInsets';
import { useRetrieveUserProfiles } from '../../common/data/users/useRetrieveUserProfiles';
import { useUploadReports } from '../../common/data/reports/useUploadReports';
import { useRetrieveReportPendingSync } from '../../common/data/reports/useRetrieveReportPendingSync';
import { useRetrieveUser } from '../../common/data/users/useRetrieveUser';
import {
  BottomSheetNavigator,
  BottomSheetNavigatorMethods,
} from './components/BottomSheetNavigator/BottomSheetNavigator';
import {
  BOTTOM_TAB_BAR_HEIGHT,
  MAP_OVERLAY_BUTTON_BOTTOM_MARGIN,
  MAP_OVERLAY_BUTTON_SIZE,
} from '../../common/constants/dimens';
import { LocationCoordinatesOverlay } from './components/LocationCoordinatesOverlay/LocationCoordinatesOverlay';
import { addDistance } from '../../common/utils/geometryUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import subjectsStorage from '../../common/data/storage/subjectsStorage';
import { SubjectsMapLayer } from './components/SubjectsMapLayer/SubjectsMapLayer';

// Icons
import { LogOutAlertIcon } from '../../common/icons/LogOutAlertIcon';
import { LocationOffAndroid } from '../../common/icons/LocationOffAndroid';
import { LocationOffForIos } from '../../common/icons/LocationOffForIos';
import { LocationCompassIcon } from '../../common/icons/LocationCompassIcon';
import { LocationGpsIcon } from '../../common/icons/LocationGpsIcon';
import { LocationOnAndroid } from '../../common/icons/LocationOnAndroid';
import { LocationOnForIos } from '../../common/icons/LocationOnForIos';
import { LayersIcon } from '../../common/icons/LayersIcon';

// Styles
import styles from './TrackLocationMapView.styles';

Mapbox.setAccessToken(Config.MAPBOX_API_KEY);

// Constants
const MAX_SYNC_RETRY_ATTEMPTS = 5;
const ZOOM_LEVEL = 16;
const COMPASS_TOP_OFFSET = 64;
const COMPASS_RIGHT_OFFSET = 12;
const SCALE_BAR_BOTTOM_OFFSET = 100;
const SCALE_BAR_LEFT_OFFSET = 16;
const VIEW_NAME = 'TrackLocationMapView';
const MAP_ANIMATION_DURATION = 3000;
const RESOURCE_ICONS = {
  // eslint-disable-next-line quote-props, global-require
  'startPatrolIcon': require('./assets/patrol-map-icon.png'),
};
const SAFE_AREA_INSETS_BOTTOM = IS_ANDROID ? 25 : 24;

// Interfaces + Types
interface TrackLocationProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TrackLocationMapView'>;
  route: RouteProp<RootStackParamList, 'TrackLocationMapView'>;
}

const TrackLocationMapView = ({
  route,
  navigation,
}: TrackLocationProps) => {
  // Hooks
  const { t } = useTranslation();
  const { retrievePatrolTypes } = useRetrievePatrolTypes();
  const { populatePatrolStop } = usePopulatePatrolStop();
  const { uploadPatrols } = useUploadPatrols();
  const { handleRefreshToken } = useRefreshToken();
  const { retrieveUserProfile } = useRetrieveUserProfiles();
  const { uploadReportAndAttachments } = useUploadReports();
  const { isConnected } = useNetInfo();
  const { retrieveReportPendingSyncCount } = useRetrieveReportPendingSync();
  const animatedPosition = useSharedValue(0);
  const { retrieveSubjectsGeoJson } = useRetrieveSubjectsGeoJson();
  const { retrieveUserInfo } = useRetrieveUser();

  // References
  const isComponentLoaded = useRef(false);
  const immediateSyncRetryAttempts = useRef(0);
  const shouldRetryPostObservations = useRef(false);
  const appIsInBackground = useRef(false);
  const isMapZoomAdjusted = useRef(false);
  const isMapCentered = useRef(false);
  const accessToken = useRef(getSession()?.access_token || '');
  const eventEmitter = useRef(getEventEmitter()).current;
  const lastTrackedLocation = useRef(nullIslandLocation);
  const isUploadAllowed = useRef(true);
  const isUserIdEmpty = useRef(false);
  const lastPatrolLocation = useRef<Position>();
  const isUsingFlyTo = useRef(false);

  // Variables
  const componentId = Math.floor(Math.random() * 10000);
  const flyTo = route.params?.flyTo;

  // Component's State
  const getPatrolStartIconGeoJson = (display: boolean, coordinates: number[]) => ({
    type: 'Feature',
    id: 'startPatrol',
    properties: {
      icon: 'startPatrolIcon',
      display,
    },
    geometry: {
      type: 'Point',
      coordinates,
    },
  });

  const [patrolStartIconFeature, setPatrolStartIconFeature] = useState(
    getPatrolStartIconGeoJson(false, nullIslandLocation),
  );
  const [userLocationTrack, setUserLocationTrack] = useState<Track[]>([]);
  const [observationsTrack, setObservationsTrack] = useState<Track[]>([]);
  const [isUserTrailEnabled, setIsUserTrailEnabled] = useState(true);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [isPatrolEnabled, setIsPatrolEnabled] = useState(false);
  const [patrolTypes, setPatrolTypes] = useState<PersistedPatrolType[]>([]);
  const [subjectsGeoJson, setSubjectsGeoJson] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>();
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [isGPSEnabled, setIsGPSEnabled] = useState(true);
  const [showConfirmationTrackLocation, setShowConfirmationTrackLocation] = useState(false);
  const [showProminentDisclosureAlert, setShowProminentDisclosureAlert] = useState(false);
  const [showConfirmTurnOffPatrolAlert, setShowConfirmTurnOffPatrolAlert] = useState(false);
  const [locationIcon, setLocationIcon] = useState(
    IS_ANDROID ? <LocationOnAndroid /> : <LocationOnForIos />,
  );
  // eslint-disable-next-line max-len
  const [currentMapLocationMode, setCurrentMapLocationMode] = useState<UserTrackingMode>();
  const [centerCoordinate, setCenterCoordinate] = useState<[number, number]>(nullIslandLocation);
  const [lastLocation, setLastLocation] = useState<LastLocation>({
    timestamp: '',
    displayDate: '',
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  });
  const [activePatrolId, setActivePatrolId] = useState(0);
  const [hasActivePatrolUploaded, setHasActivePatrolUploaded] = useState(false);
  const [basemapSelected, setBasemapSelected] = useState(
    getStringForKey(BASEMAP_KEY) || Mapbox.StyleURL.Outdoors,
  );
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>('dark-content');
  const [displayToast, setDisplayToast] = useState(false);
  const [displayCoordinatesCopied, setDisplayCoordinatesCopied] = useState(false);
  const [liveCoordinates, setLiveCoordinates] = useState(nullIslandLocation);
  const [isCompassMode, setIsCompassMode] = useState(false);
  const prominentDisclosureShown = getBoolForKey(PROMINENT_DISCLOSURE_KEY);

  /* Basemap */
  const bottomSheetNavigationRef = useRef<BottomSheetNavigatorMethods>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [trackedBySubjectID] = useMMKVString(TRACKED_BY_SUBJECT_ID_KEY, localStorage);
  const [persistedPatrolStatus] = useMMKVBoolean(PATROL_STATUS_KEY, localStorage);
  const [basemapStatus] = useMMKVString(BASEMAP_KEY, localStorage);
  const [isCustomCenterCoordsEnabled] = useMMKVBoolean(CUSTOM_CENTER_COORDS_ENABLED, localStorage);
  const [customCenterLat] = useMMKVString(CUSTOM_CENTER_COORDS_LAT, localStorage);
  const [customCenterLon] = useMMKVString(CUSTOM_CENTER_COORDS_LON, localStorage);

  // Component's Life-cycle
  useEffect(() => {
    const updatePatrolTypes = async () => {
      setPatrolTypes(await retrievePatrolTypes());
    };

    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      appIsInBackground.current = nextAppState === 'background' || nextAppState === 'inactive';
    });
    const valueChangeListener = localStorageSecured.addOnValueChangedListener((key: string) => {
      if (key === SESSION_KEY) {
        accessToken.current = getSession()?.access_token || '';
        resetTokenConfig(accessToken.current);
      }
    });

    const listenerLocalStorage = localStorage.addOnValueChangedListener((key: string) => {
      if (key === UPDATE_PATROL_TYPES_UI
        && getBoolForKey(UPDATE_PATROL_TYPES_UI)
        && getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION)) {
        updatePatrolTypes();
        setBoolForKey(UPDATE_PATROL_TYPES_UI, false);
        logTracking.info(`${VIEW_NAME} :: Patrol types ui updated`);
      }
    });

    const internetStatusListener = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable !== null) {
        setIsDeviceOnline(state.isInternetReachable);
      }
    });

    async function initLocationService() {
      if (prominentDisclosureShown) {
        await requestMapLocationPermissions();
      } else {
        setShowProminentDisclosureAlert(true);
      }
    }

    initLocationService();

    return () => {
      appStateSubscription.remove();
      valueChangeListener.remove();
      listenerLocalStorage.remove();
      internetStatusListener();
    };
  }, []);

  useEffect(() => {
    if (basemapSelected !== getStringForKey(BASEMAP_KEY)) {
      setBasemapSelected(getStringForKey(BASEMAP_KEY) || '');
    }
  }, [basemapStatus]);

  useEffect(() => {
    zoomToPosition();
    return () => {
      isUsingFlyTo.current = false;
    };
  }, [flyTo]);

  useEffect(() => {
    if (persistedPatrolStatus !== undefined) {
      setBoolForKey(ACTIVE_PATROL_KEY, persistedPatrolStatus);
    }
  }, [persistedPatrolStatus]);

  useEffect(() => {
    if (!isComponentLoaded.current) {
      isComponentLoaded.current = true;
      return;
    }

    const updateBackgroundLocationConfig = async () => {
      await BackgroundLocation.setConfig({
        locationTemplate: getLocationTemplate(userID()),
      });
      logTracking.info(`${VIEW_NAME} :: BackgroundLocation template user id updated ${userID()}`);
    };
    updateBackgroundLocationConfig();
  }, [trackedBySubjectID]);

  useEffect(() => {
    const initBackgroundGeolocation = async () => {
      const userProfile: PersistedUserProfile | null = await retrieveUserProfile();

      configureBackgroundGeolocation(
        getApiUrl(API_TRACK_OBSERVATIONS),
        accessToken.current,
        userProfile ? userProfile.remote_id : null,
      );
    };

    initBackgroundGeolocation();
  }, []);

  useEffect(() => {
    const initPatrolTypes = async () => {
      setPatrolTypes(await retrievePatrolTypes());
    };

    initPatrolTypes();

    logTracking.info(`${VIEW_NAME} :: Component ID -> [${componentId}]`);

    const trackingStatus = getBoolForKey(LOCATION_STATUS_KEY);

    toggleTracking(trackingStatus);

    if (getNumberForKey(ACTIVE_PATROL_ID_KEY) > 0) {
      setActivePatrolId(getNumberForKey(ACTIVE_PATROL_ID_KEY));
    }
  }, []);

  useEffect(() => {
    const eventListener = eventEmitter.on(START_PATROL_EVENT, (data: any) => {
      onPatrolTypeSelectHandler(data.patrol);
    });

    return () => {
      eventListener.off(START_PATROL_EVENT);
    };
  }, [isTrackingEnabled]);

  useEffect(() => {
    const onStopTrackingButtonPressHandlerAsync = async () => {
      await onStopTrackingButtonPressHandler();
    };

    const onTrackingButtonPressHandlerAsync = async () => {
      await onTrackingButtonPressHandler();
    };

    const eventListener = eventEmitter.on(BOTTOM_SHEET_NAVIGATOR, (data: any) => {
      switch (data.bottomSheetAction) {
        case BottomSheetAction.dismiss:
          bottomSheetNavigationRef.current?.restoreScreen();
          break;
        case BottomSheetAction.snapToIndex:
          bottomSheetRef.current?.snapToIndex(data.index || 0);
          break;
        default:
          break;
      }
      switch (data.bottomSheetComponentAction) {
        case BottomSheetComponentAction.startPatrol:
        case BottomSheetComponentAction.stopPatrol:
          validateTurnOffPatrols();
          break;
        case BottomSheetComponentAction.startTracking:
          onTrackingButtonPressHandlerAsync();
          bottomSheetRef.current?.close();
          break;
        case BottomSheetComponentAction.stopTracking:
          onStopTrackingButtonPressHandlerAsync();
          break;
        default:
          break;
      }
    });

    return () => {
      eventListener.off(BOTTOM_SHEET_NAVIGATOR);
    };
  }, [bottomSheetRef.current]);

  useEffect(() => {
    const uploadData = async () => {
      await uploadPatrolsData();
      await uploadReports();
    };

    const patrolStatus = getBoolForKey(PATROL_STATUS_KEY);
    const userTrailsValue = getBoolForKey(SHOW_USER_TRAILS_ENABLED_KEY);
    const trackingStatus = getBoolForKey(LOCATION_STATUS_KEY);

    setIsPatrolEnabled(patrolStatus);
    setIsUserTrailEnabled(userTrailsValue && trackingStatus);

    if (isConnected) {
      uploadData();
    }
  }, [isConnected]);

  useEffect(() => {
    updateStatusBarStyle();
  }, [basemapSelected]);

  useEffect(() => {
    if (isPatrolEnabled) {
      if (lastPatrolLocation.current) {
        const tmp = [lastLocation.longitude, lastLocation.latitude];

        const addedDistance = addDistance(
          lastPatrolLocation.current,
          tmp,
          getNumberForKey(PATROL_DISTANCE) || 0,
        );

        setNumberForKey(PATROL_DISTANCE, addedDistance);

        lastPatrolLocation.current = tmp as Position;
      } else {
        // eslint-disable-next-line no-lonely-if
        if (!isEqual(nullIslandLocation, [lastLocation.longitude, lastLocation.latitude])) {
          lastPatrolLocation.current = [lastLocation.longitude, lastLocation.latitude];
        }
      }
    }
  }, [lastLocation.timestamp, isPatrolEnabled]);

  useFocusEffect(useCallback(() => {
    setIsPatrolEnabled(getBoolForKey(PATROL_STATUS_KEY));
    setBasemapSelected(getStringForKey(BASEMAP_KEY) || Mapbox.StyleURL.Outdoors);
    updateStatusBarStyle();

    // Place Patrol Start pin when loading the view
    if (getBoolForKey(PATROL_STATUS_KEY) && getStringForKey(PATROL_START_LOCATION)) {
      // @ts-ignore
      const startLocation = getStringForKey(PATROL_START_LOCATION).split(',');
      setPatrolStartIconFeature(
        getPatrolStartIconGeoJson(
          true,
          [parseFloat(startLocation[0]), parseFloat(startLocation[1])],
        ),
      );
    }

    return () => {
      setStatusBarStyle('dark-content');
    };
  }, [isConnected]));

  useFocusEffect(useCallback(() => {
    const initSubjectsGeoJson = async () => {
      const userInfo = await retrieveUserInfo();
      // @ts-ignore
      const visibleSubjects = JSON.parse(
        subjectsStorage.subjectsKey.get() || '[]',
      ).map((item) => `'${item}'`).join(',');

      if (visibleSubjects.length === 0) {
        setSubjectsGeoJson(null);
        return;
      }

      let profileId: number | undefined;

      if (userInfo && userInfo.userType === UserType.profile) {
        const profileIdString = userInfo.userId;
        profileId = profileIdString ? parseInt(profileIdString, 10) : undefined;
      }

      const geoJson = await retrieveSubjectsGeoJson(visibleSubjects, profileId);
      setSubjectsGeoJson(geoJson);
    };

    initSubjectsGeoJson();
  }, []));

  // Utility Functions
  const updateStatusBarStyle = () => {
    if (IS_IOS) {
      setStatusBarStyle(basemapSelected === Mapbox.StyleURL.Satellite ? 'light-content' : 'dark-content');
    }
  };

  const uploadReports = async () => {
    if (isConnected && isUploadAllowed.current && !isSyncing()) {
      isUploadAllowed.current = false;
      await syncStatusReports();
      isUploadAllowed.current = true;
    }
  };

  const uploadPatrolsData = async () => {
    if (activePatrolId !== 0 || getNumberForKey(ACTIVE_PATROL_ID_KEY)) {
      if (isConnected && !hasActivePatrolUploaded) {
        try {
          const patrolUploadResults = await uploadPatrols(accessToken.current);
          const result = patrolUploadResults[0];
          if (isExpiredTokenStatus(result.status)) {
            await handleRefreshToken(navigation);
          } else if (result.status === ApiResponseCodes.Succeeded) {
            logTracking.info(`${VIEW_NAME} :: Active patrol uploaded`);
          }
        } catch (uploadActivePatrolError: any) {
          logTracking.error(`${VIEW_NAME} :: Active patrol upload failed: error`, uploadActivePatrolError);
        }
      }
    }
  };

  const zoomToPosition = async () => {
    if (flyTo) {
      setCenterCoordinate(flyTo);
      isUsingFlyTo.current = true;
    } else if (isCustomCenterCoordsEnabled && customCenterLon && customCenterLat) {
      logTracking.debug(`custom map center: ${centerCoordinate}`);
      setCenterCoordinate([parseFloat(customCenterLon), parseFloat(customCenterLat)]);
      isUsingFlyTo.current = false;
    } else {
      isUsingFlyTo.current = false;
      moveCameraToCurrentLocation();
    }
  };

  const moveCameraToCurrentLocation = async () => {
    if (flyTo) {
      return;
    }

    try {
      const position = await getCurrentPositionAsync(isUsingFlyTo.current);
      if (!isUsingFlyTo.current) {
        setCenterCoordinate([position.coords.longitude, position.coords.latitude]);
      }
    } catch (error) {
      logTracking.error('Error getting current position:', error);
    }
  };

  const syncStatusReports = async () => {
    const pendingSyncCount = await retrieveReportPendingSyncCount();
    const response = await uploadReportAndAttachments();

    if (response.reportStatus === ApiResponseCodes.Unauthorized
      || response.attachmentStatus === ApiResponseCodes.Unauthorized) {
      await handleRefreshToken(navigation);
    } else if (response.reportStatus === ApiResponseCodes.Succeeded
      || response.attachmentStatus === ApiResponseCodes.Succeeded) {
      const lastSyncDate = dayjs().format(DATE_FORMAT_HHMM_DD_MMM_YYYY);
      setNumberForKey(
        REPORTS_SUBMITTED_KEY,
        getNumberForKey(REPORTS_SUBMITTED_KEY) + pendingSyncCount,
      );
      setStringForKey(LAST_SYNC_REPORTS_TIME_KEY, lastSyncDate);
    }
  };

  const trackAnalyticsEvent = useCallback((event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  }, []);

  const turnTrackingOff = async () => {
    toggleTracking(!isTrackingEnabled);
    setIsUserTrailEnabled(false);
    setShowConfirmationTrackLocation(false);

    logTracking.debug(`${VIEW_NAME} :: Location disabled by user`);

    toggleLocationMode(UserTrackingMode.Follow);

    try {
      await syncPendingObservations();
    } catch (syncPendingObservationsError: any) {
      logTracking.error(
        `${VIEW_NAME} :: Could not sync observations after turning off tracking: error`,
        syncPendingObservationsError,
      );
    }
  };

  const getLocationIcon = (trackingMode: string) => {
    const customIcons: { [index: string]: any } = {
      normal_centered: IS_ANDROID ? <LocationOnAndroid /> : <LocationOnForIos />,
      normal_not_centered: IS_ANDROID ? <LocationOffAndroid /> : <LocationOffForIos />,
      compass_centered: <LocationCompassIcon />,
      // eslint-disable-next-line max-len
      compass_not_centered: <LocationCompassIcon color={COLORS_LIGHT.G3_secondaryMediumLightGray} />,
    };

    const defaultIcon = IS_ANDROID ? <LocationOffAndroid /> : <LocationOffForIos />;
    const status = isMapCentered.current ? 'centered' : 'not_centered';

    return customIcons[`${trackingMode}_${status}`] || defaultIcon;
  };

  const handleRequestErrorRetry = (response: HttpEvent) => {
    if (response.status === 401) {
      return;
    }

    if (response.status === 200 || response.status === 201) {
      immediateSyncRetryAttempts.current = 0;
      return;
    }

    shouldRetryPostObservations.current = appIsInBackground.current
      && (!response.success || response.status === 0);

    if (getBoolForKey(SYNC_TRACKS_MANUALLY) !== shouldRetryPostObservations.current) {
      setBoolForKey(SYNC_TRACKS_MANUALLY, shouldRetryPostObservations.current);
    }

    if (shouldRetryPostObservations.current) {
      if (immediateSyncRetryAttempts.current < MAX_SYNC_RETRY_ATTEMPTS) {
        BackgroundLocation.sync();
        immediateSyncRetryAttempts.current += 1;
        logTracking.debug(
          `[Immediate retry, attempt ${immediateSyncRetryAttempts.current}] - Manually sync observations...`,
        );
      } else {
        logTracking.debug('[Immediate retry] Max attempts reached');
      }
    }
  };

  const addEventsReanimatedStyle = useAnimatedStyle(() => ({
    top: animatedPosition.value - SAFE_AREA_INSETS_BOTTOM - BOTTOM_TAB_BAR_HEIGHT
      - MAP_OVERLAY_BUTTON_SIZE - MAP_OVERLAY_BUTTON_BOTTOM_MARGIN,
  }), []);

  const trackModeReanimatedStyle = useAnimatedStyle(() => ({
    top: animatedPosition.value - SAFE_AREA_INSETS_BOTTOM - BOTTOM_TAB_BAR_HEIGHT,
  }), []);

  // Handlers
  const onLongPressHandler = (feature: Feature) => {
    logTracking.debug(JSON.stringify(feature));
    if (getBoolForKey(MERGE_CATEGORIES_KEY)) {
      navigation.navigate('ReportTypesView', {
        title: '',
        categoryId: '',
        // @ts-ignore
        coordinates: feature.geometry.coordinates as Position,
      });
    } else {
      navigation.navigate('ReportCategoriesView', {
        // @ts-ignore
        coordinates: feature.geometry.coordinates,
      });
    }
  };

  const onUserLocationUpdateHandler = (location: Mapbox.Location) => {
    setMapUserLocation(location);
    const data: Track = {
      position: [location.coords.longitude, location.coords.latitude],
      heading: undefined,
    };

    if (!isNullIslandPosition(data.position)) {
      setUserLocationTrack((oldArray) => [...oldArray, data]);
    }
  };

  const onTrackingButtonPressHandler = useCallback(async () => {
    const observationsCount = await BackgroundLocation.getCount();

    if (isUserIdEmpty.current && observationsCount === 0) {
      setDisplayToast(true);
      return;
    }

    isMapCentered.current = true;
    toggleLocationMode(UserTrackingMode.FollowWithHeading);
    toggleTracking(!isTrackingEnabled);
    setBoolForKey(IS_DEVICE_TRACKING, true);
    logTracking.debug(`${VIEW_NAME} :: Location enabled by the user`);

    // Analytics
    trackAnalyticsEvent(createStartTrackingEvent());
  }, [isTrackingEnabled, isGPSEnabled]);

  const onStopTrackingButtonPressHandler = useCallback(async () => {
    logTracking.debug('End Tracking Button Pressed');
    trackAnalyticsEvent(createStopTrackingLocationEvent());
    setShowConfirmationTrackLocation(true);
  }, []);

  const onCreateReportButtonTappedHandler = useCallback(() => {
    if (getBoolForKey(MERGE_CATEGORIES_KEY)) {
      navigation.navigate('ReportTypesView', {
        title: '',
        categoryId: '',
      });
    } else {
      navigation.navigate('ReportCategoriesView', {});
    }
  }, [centerCoordinate]);

  const onTrackModeButtonPressHandler = () => {
    let trackMode: UserTrackingMode;

    isUsingFlyTo.current = false;

    if (!isMapCentered.current) {
      trackMode = currentMapLocationMode || UserTrackingMode.Follow;
    } else {
      trackMode = getNextTrackingMode(
        currentMapLocationMode || UserTrackingMode.Follow,
      );
      toggleLocationMode();
    }

    if (!lastLocation) {
      moveCameraToCurrentLocation();
    }

    isMapCentered.current = true;
    setCurrentMapLocationMode(trackMode);
    setLocationIcon(getLocationIcon(trackMode));
  };

  const onCameraChangedHandler = (state: MapState) => {
    setLiveCoordinates(state.properties.center as Position);
    if (state.gestures.isGestureActive) {
      isMapCentered.current = false;
      if (currentMapLocationMode === UserTrackingMode.FollowWithHeading) {
        toggleLocationMode(UserTrackingMode.Follow);
      } else {
        // eslint-disable-next-line max-len
        setLocationIcon(getLocationIcon(currentMapLocationMode || UserTrackingMode.Follow));
      }
    }
  };

  const validateTurnOffPatrols = () => {
    if (isGPSEnabled) {
      trackAnalyticsEvent(createStopPatrolEvent());
      if (isTrackingEnabled && isPatrolEnabled) {
        setShowConfirmTurnOffPatrolAlert(true);
      } else {
        onPatrolTypesToggleHandler();
      }
    }
  };

  const onPatrolTypesToggleHandler = async (continueTracking: boolean = false) => {
    if (isTrackingEnabled && isPatrolEnabled && !continueTracking) {
      toggleTracking(false);
      toggleLocationMode(UserTrackingMode.Follow);
    } else if (!isPatrolEnabled) {
      const observationsCount = await BackgroundLocation.getCount();

      if (isUserIdEmpty.current && observationsCount === 0) {
        setDisplayToast(true);
        return;
      }

      onPatrolButtonPressHandler();
    }

    setIsPatrolEnabled(!isPatrolEnabled);

    if (!isPatrolEnabled) {
      resetPatrolTypesModal();
    } else {
      setBoolForKey(PATROL_STATUS_KEY, false);
      setNumberForKey(PATROL_DISTANCE, 0);
      lastPatrolLocation.current = undefined;
      await populatePatrolStop(
        lastLocation.latitude.toString(),
        lastLocation.longitude.toString(),
      );
      // attempts to upload when online and not syncing
      if (isDeviceOnline && !isSyncing()) {
        if (activePatrolId !== undefined) {
          await uploadPatrols(accessToken.current);
          setStringForKey(LAST_SYNC_PATROLS_TIME_KEY, dayjs().format(DATE_FORMAT_HHMM_DD_MMM_YYYY));
          setHasActivePatrolUploaded(true);
          setActivePatrolId(0);
          setNumberForKey(ACTIVE_PATROL_ID_KEY, 0);
        } else {
          throw new Error('[Patrol Stop]: No active patrol ID found');
        }
      }
    }
  };

  const unauthorizedPatrolHandler = () => {
    setIsPatrolEnabled(false);
    setBoolForKey(PATROL_STATUS_KEY, false);
    setActivePatrolId(0);
    setNumberForKey(ACTIVE_PATROL_ID_KEY, 0);
  };

  const onPatrolButtonPressHandler = async () => {
    const observationsCount = await BackgroundLocation.getCount();

    if (isUserIdEmpty.current && observationsCount === 0) {
      setDisplayToast(true);
      return;
    }

    trackAnalyticsEvent(createStartPatrolEvent());

    try {
      const location = await BackgroundLocation.getCurrentPosition({
        samples: 1,
        persist: true,
      });

      navigation.navigate('PatrolsTypeView', {
        // @ts-ignore
        coordinates: [location.coords.longitude, location.coords.latitude] as Position,
      });
    } catch (error) {
      logTracking.error(`${VIEW_NAME} :: [onPatrolButtonPressHandler] - getCurrentPosition: error`, error);
    }
  };

  const resetPatrolTypesModal = () => {
    setStringForKey(PATROL_TYPE, '');
    patrolTypes.forEach((patrolTypeItem) => {
      // eslint-disable-next-line no-param-reassign
      patrolTypeItem.is_selected = false;
    });

    setPatrolTypes([...patrolTypes]);
  };

  const startPatrolState = (location: Position) => {
    setIsPatrolEnabled(true);
    setBoolForKey(PATROL_STATUS_KEY, true);

    // Start Tracking
    if (!isTrackingEnabled) {
      toggleTracking(true);
    }

    setPatrolStartIconFeature(
      getPatrolStartIconGeoJson(true, location ? [location[0], location[1]] : nullIslandLocation),
    );

    setStringForKey(PATROL_START_LOCATION, `${location[0]},${location[1]}`);
  };

  const onPatrolTypeSelectHandler = async (patrol: Patrol) => {
    setHasActivePatrolUploaded(patrol.status === PatrolResult.succeeded);

    switch (patrol.status) {
      case PatrolResult.succeeded:
      case PatrolResult.noInternet:
        if (patrol.id) {
          setActivePatrolId(patrol.id);
          setNumberForKey(ACTIVE_PATROL_ID_KEY, patrol.id);
        }
        startPatrolState(patrol.coordinates || nullIslandLocation);
        break;
      case PatrolResult.unauthorized:
        unauthorizedPatrolHandler();
        resetPatrolIcon();
        break;
      default:
        break;
    }
  };

  // Background Location library settings and updates
  const configureBackgroundGeolocation = (
    trackUrl: string,
    token: string,
    userProfileRemoteId: string | null,
  ) => {
    BackgroundLocation.onLocation(
      (location) => {
        onLocation(location);
      },
      (error) => {
        logTracking.error(`${VIEW_NAME} :: onLocation error ->`, error);
      },
    );

    BackgroundLocation.onHeartbeat((event) => { onHeartbeat(event); });
    BackgroundLocation.onHttp((response) => { onHttp(response); });
    BackgroundLocation.onProviderChange((event) => { onProviderChange(event); });
    BackgroundLocation.onConnectivityChange((event) => { logTracking.info('onConnectivityChange', event); });
    // eslint-disable-next-line max-len
    BackgroundLocation.onPowerSaveChange((isPowerSaveMode) => { logTracking.info('onPowerSaveChange: is enabled?', isPowerSaveMode); });
    // eslint-disable-next-line max-len
    BackgroundLocation.onEnabledChange((isEnabled) => { logTracking.info('onEnabledChanged: location services are enabled?', isEnabled); });
    BackgroundLocation.onAuthorization((event) => { logTracking.info('onAuthorization', event); });

    if (userID()) {
      BackgroundLocation.ready({
        ...backgroundLocationConfig(trackUrl, userID(), token, userProfileRemoteId),
        backgroundPermissionRationale: {
          title: t('mapTrackLocation.permissions.title'),
          message: t('mapTrackLocation.permissions.message'),
          positiveAction: t('mapTrackLocation.permissions.positiveAction'),
          negativeAction: t('mapTrackLocation.permissions.negativeAction'),
        },
      });
      isUserIdEmpty.current = false;
    } else {
      isUserIdEmpty.current = true;
    }
  };

  const userID = () => trackedBySubjectID
    || getSecuredStringForKey(USER_REMOTE_ID_KEY) || '';

  const resetTokenConfig = (token: string) => {
    BackgroundLocation.setConfig({
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': USER_AGENT_VALUE,
      },
    });
    logTracking.debug(`${VIEW_NAME} :: Token updated on BackgroundGeolocation`);
  };

  const toggleTracking = (enabled: boolean) => {
    if (isGPSEnabled) {
      setIsTrackingEnabled(enabled);

      if (enabled) {
        BackgroundLocation.start(() => {
          logTracking.info(`${VIEW_NAME} :: Location services started`);
        });
        BackgroundLocation.changePace(true);
        if (observationsTrack.length === 0) {
          const data: Track = {
            position: getMapUserPosition() as Position,
            heading: undefined,
          };
          if (!isNullIslandPosition(data.position)) {
            setObservationsTrack([data]);
          }
        }

        setBoolForKey(IS_DEVICE_TRACKING, true);
      } else {
        BackgroundLocation.changePace(false);
        BackgroundLocation.stop();
        logTracking.info(`${VIEW_NAME} :: Location services stopped`);
        setBoolForKey(IS_DEVICE_TRACKING, false);
      }

      setIsUserTrailEnabled(enabled);
      setBoolForKey(LOCATION_STATUS_KEY, enabled);
    }
  };

  // Background Location library handlers
  const onLocation = (location: Location): void => {
    logTracking.info(`${VIEW_NAME} :: Location tracked ->`, location);

    if (!isEqual(
      lastTrackedLocation.current,
      [location.coords.longitude, location.coords.latitude],
    )) {
      lastTrackedLocation.current = [location.coords.longitude, location.coords.latitude];
      setLastLocation({
        timestamp: dayjs().format('YYYY-DD-MM[T]hh:mm:ss[Z]'),
        displayDate: dayjs().format('DD MMM HH:mm:ss'),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      setStringForKey(LAST_SYNC_LOCATION_TIME_KEY, lastLocation.displayDate);
      handleMapTrailsLocation(location);
    }
  };

  const handleMapTrailsLocation = (location: Location) => {
    const data: Track = {
      position: [location.coords.longitude, location.coords.latitude],
      heading: location.coords.heading,
    };
    if (!isNullIslandPosition(data.position)
      // eslint-disable-next-line max-len
      && isValidObservationThreshold(last(observationsTrack)?.position || nullIslandLocation, data.position)
      && isValidObservationAccuracy(location.coords.accuracy)) {
      setObservationsTrack((oldArray) => {
        setUserLocationTrack([...oldArray, data]);
        return [...oldArray, data];
      });
    }
  };

  const onHttp = async (response: HttpEvent) => {
    logTracking.info(`${VIEW_NAME} :: onHttp ->`, response);

    if (isExpiredTokenStatus(response.status as ApiResponseCodes)) {
      await handleRefreshToken(navigation);
    }

    handleRequestErrorRetry(response);
  };

  const onHeartbeat = async (event: HeartbeatEvent) => {
    logTracking.info(`${VIEW_NAME} :: onHeartbeat ->`, event);
    try {
      const location = await BackgroundLocation.getCurrentPosition({
        samples: 1,
        persist: true,
      });

      logTracking.info(`${VIEW_NAME} :: [onHeartbeat] - getCurrentPosition ->`, location);
    } catch (locationError) {
      logTracking.error(`${VIEW_NAME} :: [onHeartbeat] - getCurrentPosition: error`, locationError);
    }

    if (shouldRetryPostObservations.current) {
      await BackgroundLocation.sync();
      logTracking.debug('Manually sync observations...');
    }
  };

  const onProviderChange = (event: ProviderChangeEvent) => {
    logTracking.info(`${VIEW_NAME} :: onProviderChange ->`, event);

    switch (event.status) {
      case BackgroundLocation.AUTHORIZATION_STATUS_ALWAYS:
      case BackgroundLocation.AUTHORIZATION_STATUS_WHEN_IN_USE:
        logTracking.info(
          `${VIEW_NAME} :: [zoom issue] Location permission accepted, tracking enabled ->`,
          isTrackingEnabled,
        );

        trackAnalyticsEvent(createLocationPermissionAllowedEvent());

        if (!isMapZoomAdjusted.current) {
          moveCameraToCurrentLocation();
        }
        break;
      case BackgroundLocation.AUTHORIZATION_STATUS_DENIED:
        logTracking.info(`${VIEW_NAME} :: Location permission not determined`);
        trackAnalyticsEvent(createLocationPermissionDeniedEvent());
        break;
      default:
        break;
    }

    if (event.gps) {
      setIsGPSEnabled(true);
      setLocationIcon(getLocationIcon('none'));
    } else {
      setIsGPSEnabled(false);
      setLocationIcon(<LocationGpsIcon />);
    }
  };

  const getBasemapIcon = () => (
    <View style={styles.basemapIconContainer}>
      <LayersIcon />
    </View>
  );

  const resetPatrolIcon = () => {
    setPatrolStartIconFeature(
      getPatrolStartIconGeoJson(false, [lastLocation.longitude, lastLocation.latitude]),
    );
  };

  const handleOnPatrolPinPress = () => {
    bottomSheetNavigationRef.current?.navigate('PatrolDetailsView', null, true);
  };

  const handleOnBasemapPress = () => {
    bottomSheetNavigationRef.current?.navigate('Basemap', null, true);
  };

  const handleOnSubjectPress = (event: any) => {
    // Ignore taps on cluster circles
    if (event.features[0].properties.cluster) {
      return;
    }

    const selectedSubjectData = {
      name: event.features[0].properties.title,
      coordinates: event.coordinates,
      lastUpdate: event.features[0].properties.coordinateProperties.time,
      id: event.features[0].properties.id,
    };

    setStringForKey(SELECTED_SUBJECT_IN_MAP, JSON.stringify(selectedSubjectData));

    bottomSheetNavigationRef.current?.navigate('SubjectDetailsView', null, true);
  };

  const liveCoodinatesDisplay = useCallback(() => (
    <LocationCoordinatesOverlay
      location={liveCoordinates}
      displayToast={setDisplayCoordinatesCopied}
    />
  ), [liveCoordinates]);

  const toggleLocationMode = (locationMode?: UserTrackingMode) => {
    if (locationMode) {
      setIsCompassMode(locationMode === UserTrackingMode.FollowWithHeading);
      setLocationIcon(getLocationIcon(locationMode));
      setCurrentMapLocationMode(locationMode);
    } else {
      setIsCompassMode(!isCompassMode);
    }
  };

  return (
    <>
      {(IS_IOS && <StatusBar translucent barStyle={statusBarStyle} />)}
      {/* Map */}
      <MapView
        compassEnabled
        compassFadeWhenNorth={!IS_ANDROID}
        compassPosition={{ top: COMPASS_TOP_OFFSET, right: COMPASS_RIGHT_OFFSET }}
        scaleBarEnabled
        scaleBarPosition={{ bottom: SCALE_BAR_BOTTOM_OFFSET, left: SCALE_BAR_LEFT_OFFSET }}
        attributionPosition={{ bottom: SCALE_BAR_BOTTOM_OFFSET + 8, left: SCALE_BAR_LEFT_OFFSET }}
        onLongPress={onLongPressHandler}
        onCameraChanged={isTrackingEnabled ? (state) => onCameraChangedHandler(state) : undefined}
        style={styles.map}
        styleURL={basemapSelected}
      >
        <Camera
          defaultSettings={{
            zoomLevel: ZOOM_LEVEL,
          }}
          animationMode="flyTo"
          animationDuration={MAP_ANIMATION_DURATION}
          centerCoordinate={
            !isUsingFlyTo.current && isCustomCenterCoordsEnabled
              ? [
                parseFloat(customCenterLon || '0'),
                parseFloat(customCenterLat || '0'),
              ]
              : centerCoordinate
          }
          followUserLocation={isCompassMode}
          followUserMode={isCompassMode ? UserTrackingMode.FollowWithHeading : UserTrackingMode.Follow}
          followZoomLevel={ZOOM_LEVEL}
        />
        <Images images={RESOURCE_ICONS} />

        {/* Subjects */}
        {subjectsGeoJson ? (
          <SubjectsMapLayer subjectsGeoJson={subjectsGeoJson} onPress={(event) => { handleOnSubjectPress(event); }} />
        ) : null}
        {/* End Subjects */}

        <ShapeSource
          id="patrolStartLocation"
          // @ts-ignore
          shape={{ ...patrolStartIconFeature }}
          onPress={handleOnPatrolPinPress}
        >
          <SymbolLayer
            id="startPatrolSymbolLayer"
            filter={['==', 'display', true]}
            style={{
              iconImage: ['get', 'icon'],
              iconAllowOverlap: true,
              iconSize: 0.5,
              iconOffset: [0, -23],
            }}
          />
        </ShapeSource>
        {(userLocationTrack.length > 0 && isUserTrailEnabled)
          && (<UserTrailsMapLayer track={userLocationTrack} />)}
        {(observationsTrack.length > 0 && isUserTrailEnabled)
          && (<UserTrailPointsMapLayer track={observationsTrack} />)}
        <UserLocation
          renderMode={isCompassMode ? UserLocationRenderModeType.Native : UserLocationRenderModeType.Normal}
          visible
          showsUserHeadingIndicator
          onUpdate={onUserLocationUpdateHandler}
          requestsAlwaysUse
          minDisplacement={10}
        />
      </MapView>
      {/* End Map */}

      {/* Basemap layer button */}
      {(isDeviceOnline) && (
        <Button
          style={[styles.basemapButton, { top: getTopAreaInsets() + (IS_ANDROID ? 18 : 16) }]}
          round
          enableShadow
          iconSource={getBasemapIcon}
          onPress={handleOnBasemapPress}
        />
      )}
      {/* End Basemap layer button */}

      {/* Missing GPS */}
      {!isGPSEnabled && (
        <MissingGPS />
      )}
      {/* End Missing GPS */}

      {/* Tracking Overlay (Button + Dropdown Menu) */}
      <TrackingOverlay
        isDeviceOnline={isDeviceOnline}
        isTrackingEnabled={isTrackingEnabled}
        isPatrolEnabled={isPatrolEnabled}
      />
      {/* End Tracking Overlay (Button + Dropdown Menu) */}

      {/* LocationCoordiantesOverlay */}
      {isTrackingEnabled && liveCoodinatesDisplay()}
      {/* End LocationCoordiantesOverlay */}

      {/* Add Reports */}
      <Animated.View
        style={[styles.addReportButton, addEventsReanimatedStyle]}
        accessibilityLabel="Add Report Button"
      >
        <AddEventButton onPress={onCreateReportButtonTappedHandler} />
      </Animated.View>
      {/* End Add Reports */}

      {/* Track Mode Button */}
      {(isGPSEnabled) && (
        <Animated.View style={[styles.TrackModeButtonContainer, trackModeReanimatedStyle]}>
          <Pressable
            onPress={() => {
              trackAnalyticsEvent(createStartTrackingLocationEvent());
              onTrackModeButtonPressHandler();
            }}
          >
            <View style={styles.iconContainer}>
              {locationIcon}
            </View>
          </Pressable>
        </Animated.View>
      )}
      {/* End Track Mode Button */}

      {/* Action Sheet Navigator */}
      <BottomSheetNavigator
        bottomSheetRef={bottomSheetRef}
        bottomSheetMethodsRef={bottomSheetNavigationRef}
        sharedAnimatedPosition={animatedPosition}
      />
      {/* End Action Sheet Navigator */}

      {/* Custom Alert */}
      <CustomAlert
        displayAlert={showConfirmationTrackLocation}
        alertIcon={<LogOutAlertIcon />}
        alertTitleText={t('mapTrackLocation.trackDialog.title')}
        alertMessageText={t('mapTrackLocation.trackDialog.message')}
        positiveButtonText={t('mapTrackLocation.trackDialog.positiveAction')}
        negativeButtonText={t('mapTrackLocation.trackDialog.negativeAction')}
        onPositiveButtonPress={turnTrackingOff}
        onNegativeButtonPress={() => {
          setShowConfirmationTrackLocation(false);
          logTracking.debug('Cancel disable confirmation dialog');
        }}
        positiveButtonBackgroundColor={COLORS_LIGHT.red}
      />
      {/* End Custom Alert */}

      {/* Alert - Request location permissions */}
      <CustomAlert
        displayAlert={showProminentDisclosureAlert}
        alertTitleText={t('loginView.alertDialog.title')}
        alertMessageText={t('loginView.alertDialog.message')}
        positiveButtonText={t('loginView.alertDialog.action')}
        onPositiveButtonPress={async () => {
          setShowProminentDisclosureAlert(false);
          setBoolForKey(PROMINENT_DISCLOSURE_KEY, true);
          await requestMapLocationPermissions();
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />
      {/* End Alert - Request location permissions */}

      {/* Alert - Confirm turn off patrols */}
      <CustomAlert
        displayAlert={showConfirmTurnOffPatrolAlert}
        alertMessageText={t('mapTrackLocation.patrolDialog.message')}
        positiveButtonText={t('mapTrackLocation.patrolDialog.positiveAction')}
        negativeButtonText={t('mapTrackLocation.patrolDialog.negativeAction')}
        onPositiveButtonPress={() => {
          setShowConfirmTurnOffPatrolAlert(false);
          onPatrolTypesToggleHandler(true);
          resetPatrolIcon();
        }}
        onNegativeButtonPress={() => {
          setShowConfirmTurnOffPatrolAlert(false);
          onPatrolTypesToggleHandler();
          resetPatrolIcon();
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />
      {/* End Alert - Confirm turn off patrols */}

      {/* User missing ID Toast */}
      <Incubator.Toast
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        message={t('mapTrackLocation.noUserId')}
        messageStyle={{ color: COLORS_LIGHT.white }}
        onDismiss={() => setDisplayToast(false)}
        position="bottom"
        style={{ borderRadius: 0 }}
        visible={displayToast}
      />
      {/* End User missing ID Toast */}

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

export { TrackLocationMapView };
