// External Dependencies
import React, { useCallback, useEffect, useState } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Dimensions, Image, Linking, Pressable, ScrollView, Switch, View,
} from 'react-native';
import { Text } from 'react-native-ui-lib';
import { useTranslation } from 'react-i18next';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DeviceInfo from 'react-native-device-info';
import { useMMKVString } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';

// Internal Dependencies
import { logEvent } from '../../../analytics/wrapper/analyticsWrapper';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../../analytics/model/analyticsEvent';
import {
  createConfirmLogoutEvent,
  createConfirmLogoutPendingSyncEvent,
  createLogoutSelectedEvent,
  createReportIssueSelectedEvent,
  createSwitchActiveUserEvent,
} from '../../../analytics/settings/settingsAnalytics';
import { CustomAlert } from '../../../common/components/CustomAlert/CustomAlert';
import {
  ACTIVE_PATROL_KEY,
  ACTIVE_USER_NAME_KEY,
  ALERT_BUTTON_BACKGROUND_COLOR_BLUE,
  ALERT_BUTTON_BACKGROUND_COLOR_RED,
  BASEMAP_KEY,
  COORDINATES_FORMAT_KEY,
  EXPERIMENTAL_FEATURES_FLAG_KEY,
  IS_DEVICE_TRACKING,
  MERGE_CATEGORIES_KEY, PATROL_DEFAULT_EVENT_TYPE_VALUE,
  PATROL_STATUS_KEY,
  PHOTO_QUALITY_KEY,
  REMEMBER_ME_CHECKBOX_KEY,
  SAVE_TO_CAMERA_ROLL,
  SETTINGS_VIEW_DISAPPEAR_KEY,
  SITE_VALUE_KEY,
  START_PATROL_METADATA,
  TRACKED_BY_SUBJECT_ID_KEY,
  TRACKED_BY_SUBJECT_NAME_KEY,
  TRACKED_BY_SUBJECT_STATUS_KEY,
  UPLOAD_PHOTOS_WIFI,
  USER_NAME_KEY,
} from '../../../common/constants/constants';
import { SITE } from '../../../api/EarthRangerService';
import { getSecuredStringForKey, setSecuredStringForKey } from '../../../common/data/storage/utils';
import {
  getBoolForKey,
  getStringForKey,
  localStorage,
  setBoolForKey,
  setStringForKey,
} from '../../../common/data/storage/keyValue';
import { isObservationPendingData, nullIslandLocation } from '../../../common/utils/locationUtils';
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { RootStackParamList } from '../../../common/types/types';
import { deleteSession } from '../../../common/utils/deleteSession';
import log, { logSQL } from '../../../common/utils/logUtils';
import { useGetNumberReportDrafts } from '../../../common/data/reports/useGetNumberReportDrafts';
import { useRetrieveReportPendingSync } from '../../../common/data/reports/useRetrieveReportPendingSync';
import { useRetrievePendingSyncPatrol } from '../../../common/data/patrols/useRetrievePendingSyncPatrol';
import { getAuthState, setAuthState } from '../../../common/utils/authUtils';
import { AuthState } from '../../../common/enums/enums';
import { useRetrieveData } from '../../../common/data/hooks/useRetrieveData';
import { useGetDBConnection } from '../../../common/data/PersistentStore';
import { SELECT_USER_BY_USERNAME } from '../../../common/data/sql/queries';
import { useRetrieveReportTypes } from '../../../common/data/reports/useRetrieveReportTypes';

// Icons
import { icons } from '../../../ui/AssetsUtils';
import { EarthRangerSiteIcon } from '../../../common/icons/EarthRangerSiteIcon';
import { LogOutIcon } from '../../../common/icons/LogOutIcon';
import { MergeCategoriesIcon } from '../../../common/icons/MergeCategoriesIcon';
import { LogOutAlertIcon } from '../../../common/icons/LogOutAlertIcon';
import { PrivacyPolicyIcon } from '../../../common/icons/PrivacyPolicyIcon';
import { EndUserAgreementIcon } from '../../../common/icons/EndUserAgreementIcon';
import { ReportAnIssueIcon } from '../../../common/icons/ReportAnIssueIcon';
import { ActiveUserIcon } from '../../../common/icons/ActiveUserIcon';
import { ChevronIcon } from '../../../common/icons/ChevronIcon';
import { SwitchTrackedByUser } from '../../../common/icons/SwitchTrackedByUser';
import { TrackByIcon } from '../../../common/icons/TrackByIcon';
import { LayersIcon } from '../../../common/icons/LayersIcon';
import { HelpCenterIcon } from '../../../common/icons/HelpCenterIcon';
import { CoordinatesIcon } from '../../../common/icons/CoordinatesIcon';
import { DarkModeIcon } from '../../../common/icons/DarkModeIcon';
import { ArrowDisabledIcon } from '../../../common/icons/ArrowDisabledIcon';
import { ImageIcon } from '../../../common/icons/ImageIcon';
import { QualityType } from '../../../common/utils/imageUtils';
import { CameraRollIcon } from '../../../common/icons/CameraRollIcon';
import { WiFiIcon } from '../../../common/icons/WiFiIcon';
import { PatrolStartIcon } from '../../../common/icons/PatrolStartIcon';
import { DatabaseIcon } from '../../../common/icons/DatabaseIcon';

// Styles
import { style } from './style';

// Constants
const MAX_CLICKS_SITE_NAME = 7;
const TOP_AND_BOTTOM_BARS_SIZE = 120;
const version = DeviceInfo.getVersion();
const buildNum = DeviceInfo.getBuildNumber();

// Interfaces + Types
interface SettingsViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SettingsView'>;
}

export const SettingsView = ({
  navigation,
}: SettingsViewProps) => {
  // Variables
  let counterTapsSiteName = 0;

  // hooks
  const { getNumberReportDrafts } = useGetNumberReportDrafts();
  const { retrieveReportPendingSyncCount } = useRetrieveReportPendingSync();
  const { retrievePendingSyncPatrols } = useRetrievePendingSyncPatrol();
  const { retrieveData } = useRetrieveData();
  const { getDBInstance } = useGetDBConnection();
  const { retrieveDefaultEventType, retrieveEventTypeDisplayByValue } = useRetrieveReportTypes();
  // eslint-disable-next-line max-len
  const [patrolDefaultEventTypeStatus] = useMMKVString(PATROL_DEFAULT_EVENT_TYPE_VALUE, localStorage);

  // components state
  const [siteValue, setSite] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userNameValue, setUserName] = useState('');
  const [trackedBySubjectName] = useMMKVString(TRACKED_BY_SUBJECT_NAME_KEY, localStorage);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showAlertTrackingDialog, setShowAlertTrackingDialog] = useState(false);
  const [showAlertDialogPendingSync, setShowAlertDialogPendingSync] = useState(false);
  const [showAlertDialogSwitchUser, setShowAlertDialogSwitchUser] = useState(false);
  const [experimentalFeaturesEnabled, setExperimentalFeaturesEnabled] = useState(false);
  const [isLoginUser, setIsLoginUser] = useState(false);
  const [pinRequired, setPinRequired] = useState(false);
  // eslint-disable-next-line max-len
  const [isMergeCategoriesEnabled, setIsMergeCategoriesEnabled] = useState(getBoolForKey(MERGE_CATEGORIES_KEY));
  // eslint-disable-next-line max-len
  const [isSaveToCameraRollEnabled, setIsSaveToCameraRollEnabled] = useState(getBoolForKey(SAVE_TO_CAMERA_ROLL));
  // eslint-disable-next-line max-len
  const [isUploadPhotosWifiEnabled, setIsUploadPhotosWifiEnabled] = useState(getBoolForKey(UPLOAD_PHOTOS_WIFI));
  const [isSwitchTrackBySubjectEnabled, setIsSwitchTrackBySubjectEnabled] = useState(false);
  const [isPatrolEventDetailsEnabled, setIsPatrolEventDetailsEnabled] = useState(
    getBoolForKey(START_PATROL_METADATA) || false,
  );
  const [defaultEventType, setDefaultEventType] = useState('');
  const { t } = useTranslation();
  const { height } = Dimensions.get('window');
  const [screenHeight, setScreenHeight] = useState(height);
  const [basemapName, setBasemapName] = useState('topo');
  const [isActivelyTracking, setIsActivelyTracking] = useState(false);
  const [coordinatesFormat] = useMMKVString(COORDINATES_FORMAT_KEY, localStorage);
  const [photoQuality] = useMMKVString(PHOTO_QUALITY_KEY, localStorage);
  const [isDeviceOnline, setIsDeviceOnline] = useState(true);

  useEffect(() => {
    initSiteValue();
    initUserNameValue();
    initDefaultEventTypeValue();
    setExperimentalFeaturesEnabled(getBoolForKey(EXPERIMENTAL_FEATURES_FLAG_KEY));
    setIsSwitchTrackBySubjectEnabled(getBoolForKey(TRACKED_BY_SUBJECT_STATUS_KEY));
  }, []);

  useEffect(() => {
    const unsubscribeListener = navigation.addListener('blur', () => {
      setShowAlertDialogPendingSync(false);
      setShowAlertDialog(false);
    });

    return unsubscribeListener;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setBoolForKey(SETTINGS_VIEW_DISAPPEAR_KEY, true);
      switch (getStringForKey(BASEMAP_KEY)) {
        case MapboxGL.StyleURL.Outdoors:
          setBasemapName('topo');
          break;
        case MapboxGL.StyleURL.Satellite:
          setBasemapName('satellite');
          break;
        case MapboxGL.StyleURL.Street:
        default:
          setBasemapName('street');
          break;
      }

      // Listen for internet connection status
      const internetStatusListener = NetInfo.addEventListener((state) => {
        if (state.isInternetReachable !== null) {
          setIsDeviceOnline(state.isInternetReachable);
        }
      });

      setIsActivelyTracking(getBoolForKey(IS_DEVICE_TRACKING));
      const authState = getAuthState();
      setPinRequired(authState === AuthState.required || authState === AuthState.authenticated);

      return () => {
        internetStatusListener();
      };
    }, []),
  );

  useEffect(() => {
    const initDefaultEventTypeValueAsync = async () => {
      if (isPatrolEventDetailsEnabled) {
        await initDefaultEventTypeValue();
      }
    };
    initDefaultEventTypeValueAsync();
  }, [patrolDefaultEventTypeStatus, isPatrolEventDetailsEnabled]);

  const initSiteValue = () => {
    const host = getSecuredStringForKey(SITE_VALUE_KEY);
    setSite(host + SITE.domain);
  };

  const initDefaultEventTypeValue = async () => {
    const eventTypeValue = getStringForKey(PATROL_DEFAULT_EVENT_TYPE_VALUE);
    if (eventTypeValue) {
      const eventTypeDisplay = await retrieveEventTypeDisplayByValue(eventTypeValue);
      setDefaultEventType(eventTypeDisplay);
    } else {
      const eventType = await retrieveDefaultEventType();
      setDefaultEventType(eventType?.defaultEventTypeDisplay || '');
      setStringForKey(PATROL_DEFAULT_EVENT_TYPE_VALUE, eventType?.defaultEventTypeValue);
    }
  };

  const initUserNameValue = async () => {
    const user = getSecuredStringForKey(ACTIVE_USER_NAME_KEY);
    setUserName(user!);

    try {
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const userDetails = await retrieveData(
          dbInstance,
          SELECT_USER_BY_USERNAME,
          [user!],
        );

        if (userDetails && userDetails[0].rows.length > 0) {
          setIsLoginUser(true);
        }
      }
    } catch (error) {
      logSQL.error('[SettingsView] - retrieve user', error);
    }
  };

  // utilities
  const verifyLogOut = async () => {
    const observationsPendingData = await isObservationPendingData();
    const reportsPendingData = await isReportPendingData();
    const patrolsPendingData = await isPatrolPendingData();

    if (getBoolForKey(IS_DEVICE_TRACKING)) {
      setShowAlertTrackingDialog(true);
    } else if (observationsPendingData || reportsPendingData || patrolsPendingData) {
      setShowAlertDialogPendingSync(true);
    } else {
      setShowAlertDialog(true);
    }
  };

  const isReportPendingData = async () => {
    const reportDrafts = await getNumberReportDrafts();
    if (reportDrafts > 0) {
      return true;
    }

    const pendingSyncReports = await retrieveReportPendingSyncCount();
    return pendingSyncReports > 0;
  };

  const isPatrolPendingData = async () => {
    if (getBoolForKey(ACTIVE_PATROL_KEY)) {
      return true;
    }
    const patrolsListPendingSync = await retrievePendingSyncPatrols();
    return patrolsListPendingSync.length > 0;
  };

  const siteNameTapped = () => {
    if (experimentalFeaturesEnabled) return;
    resetCounterIfNeeded();
    counterTapsSiteName += 1;
    if (counterTapsSiteName >= MAX_CLICKS_SITE_NAME) {
      counterTapsSiteName = 0;
      setBoolForKey(EXPERIMENTAL_FEATURES_FLAG_KEY, true);
      setExperimentalFeaturesEnabled(true);
    }
    setBoolForKey(SETTINGS_VIEW_DISAPPEAR_KEY, false);
  };

  const resetCounterIfNeeded = () => {
    if (getBoolForKey(SETTINGS_VIEW_DISAPPEAR_KEY)) counterTapsSiteName = 0;
  };

  const resetPatrolEventDetailsSettings = () => {
    setBoolForKey(START_PATROL_METADATA, false);
  };

  const toggleExperimentalFeatures = async () => {
    const toggle = !experimentalFeaturesEnabled;
    setExperimentalFeaturesEnabled(toggle);
    setBoolForKey(EXPERIMENTAL_FEATURES_FLAG_KEY, toggle);
    setStringForKey(TRACKED_BY_SUBJECT_NAME_KEY, '');
    setStringForKey(TRACKED_BY_SUBJECT_ID_KEY, '');
    setIsSwitchTrackBySubjectEnabled(false);

    if (!toggle) {
      resetPatrolEventDetailsSettings();
    }

    setIsPatrolEventDetailsEnabled(getBoolForKey(START_PATROL_METADATA) || false);
  };

  const toggleMergeCategories = () => {
    const toggle = !isMergeCategoriesEnabled;
    setIsMergeCategoriesEnabled(toggle);
    setBoolForKey(MERGE_CATEGORIES_KEY, toggle);
  };

  const toggleStartPatrolMetaData = async () => {
    const toggle = !isPatrolEventDetailsEnabled;
    setIsPatrolEventDetailsEnabled(toggle);
    setBoolForKey(START_PATROL_METADATA, toggle);

    if (!toggle) {
      resetPatrolEventDetailsSettings();
    }
  };

  const toggleSwitchTrackedByUser = () => {
    const toggle = !isSwitchTrackBySubjectEnabled;
    setIsSwitchTrackBySubjectEnabled(toggle);
    setBoolForKey(TRACKED_BY_SUBJECT_STATUS_KEY, toggle);

    if (!toggle) {
      setStringForKey(TRACKED_BY_SUBJECT_NAME_KEY, '');
      setStringForKey(TRACKED_BY_SUBJECT_ID_KEY, '');
    }
  };

  const onLogout = async () => {
    try {
      await deleteSession();
      setAuthState(AuthState.unknown);
      navigation.navigate('SplashScreen');
    } catch {
      log.error('');
    }
  };

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  };

  const onLogoutPressed = () => {
    verifyLogOut();
    trackAnalyticsEvent(createLogoutSelectedEvent());
  };

  const onContentSizeChange = (contentWidth: any, contentHeight: React.SetStateAction<number>) => {
    setScreenHeight(contentHeight);
  };

  const switchActiveUserTapped = async () => {
    trackAnalyticsEvent(createSwitchActiveUserEvent());
    const patrolStatus = getBoolForKey(PATROL_STATUS_KEY);
    if (isActivelyTracking) {
      setShowAlertDialogSwitchUser(true);
    } else if (pinRequired && !patrolStatus) {
      setStringForKey(TRACKED_BY_SUBJECT_ID_KEY, '');
      setStringForKey(TRACKED_BY_SUBJECT_NAME_KEY, '');
      navigateTo('PinAuthenticationView');
    }
  };

  const handleOnPatrolDefaultEventType = () => {
    navigation.navigate('ReportTypesView', {
      title: '',
      categoryId: '',
      coordinates: nullIslandLocation,
      isDefaultPatrolTypeEnabled: true,
    });
  };

  const navigateTo = (name: string) => {
    navigation.dispatch(
      CommonActions.navigate({
        name,
        params: {},
      }),
    );
  };

  const openURLInBrowser = (url: string) => {
    if (isDeviceOnline) {
      Linking.openURL(url).catch((error) => log.error("Couldn't load page", error));
    }
  };

  const getPhotoQualityString: Record<QualityType, string> = {
    [QualityType.HIGH]: t('settingsView.high'),
    [QualityType.MEDIUM]: t('settingsView.medium'),
    [QualityType.LOW]: t('settingsView.low'),
  };

  return (
    <SafeAreaView style={style.containerSafeArea} edges={['bottom']}>
      <ScrollView
        scrollEnabled={screenHeight > height - TOP_AND_BOTTOM_BARS_SIZE}
        onContentSizeChange={onContentSizeChange}
      >
        {/* Logo */}
        <View style={style.logoContainer}>
          <Image style={style.logo} source={icons.AboutView.logoAbout} />
        </View>
        {/* End Logo */}

        {/* Switch Active User */}
        <View style={style.line} />
        <View style={style.switchUserContainer}>
          <View style={style.usernameContainer}>
            {/* Icon */}
            <View style={style.settingIcon}>
              <ActiveUserIcon />
            </View>
            {/* Text */}
            <Text style={style.textUsername}>{userNameValue}</Text>
          </View>
          { pinRequired ? (
            <Pressable style={style.switchUserButton} onPress={switchActiveUserTapped}>
              <View style={style.switchUserIcon}>
                <LogOutIcon />
              </View>
              <Text style={style.textSettingName} numberOfLines={2}>
                {t('settingsView.switchActiveUser')}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {/* End Switch Active User */}

        {/* Category Label */}
        <View style={style.labelContainer}>
          <Text label>{t('settingsView.dataCollection')}</Text>
        </View>
        {/* End Category Label */}

        {/* Patrol Config */}
        {experimentalFeaturesEnabled && (
          <View style={style.menuItemContainer}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <PatrolStartIcon color={COLORS_LIGHT.G2_5_mobileSecondaryGray} />
              </View>
              <View style={style.settingTextContainer}>
                <Text
                  style={style.textSettingName}
                  numberOfLines={2}
                >
                  {t('settingsView.patrolEventDetails')}
                </Text>
              </View>
              <Switch
                style={style.switchSetting}
                trackColor={{ false: COLORS_LIGHT.G5_LightGreyLines, true: COLORS_LIGHT.blueLight }}
                thumbColor={
                  isPatrolEventDetailsEnabled
                    ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G3_secondaryMediumLightGray
                }
                onValueChange={toggleStartPatrolMetaData}
                value={isPatrolEventDetailsEnabled}
              />
            </View>
          </View>
        )}
        {/* End Patrol Config */}

        {/* Patrol Type */}
        {experimentalFeaturesEnabled && isPatrolEventDetailsEnabled && (
          <View style={style.menuSubItemContainer}>
            <Pressable onPress={handleOnPatrolDefaultEventType}>
              <View style={style.subSettingContainer}>
                <View style={style.settingIcon} />
                <View style={style.textIcon}>
                  <Text
                    style={style.textSettingName}
                  >
                    {t('settingsView.eventType')}
                  </Text>
                  <Text
                    style={style.textSettingDescription}
                  >
                    {defaultEventType}
                  </Text>
                </View>
                <ChevronIcon />
              </View>
            </Pressable>
          </View>
        )}
        {/* End Patrol Type */}

        {/* Merge Categories */}
        <View style={style.menuItemContainer}>
          <View style={style.settingContainer}>
            <View style={style.settingIcon}>
              <MergeCategoriesIcon />
            </View>
            <View style={style.settingTextContainer}>
              <Text
                style={style.textSettingName}
                numberOfLines={2}
              >
                {t('settingsView.mergeEventCategories')}
              </Text>
              <Text
                style={style.textSettingDescription}
                numberOfLines={2}
              >
                {t('settingsView.mergeEventCategoriesDescription')}
              </Text>
            </View>
            <Switch
              style={style.switchSetting}
              trackColor={{ false: COLORS_LIGHT.G5_LightGreyLines, true: COLORS_LIGHT.blueLight }}
              thumbColor={
                isMergeCategoriesEnabled
                  ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G3_secondaryMediumLightGray
              }
              onValueChange={toggleMergeCategories}
              value={isMergeCategoriesEnabled}
            />
          </View>
        </View>
        {/* End Merge Categories */}

        {/* Switch Tracked By Subject */}
        {experimentalFeaturesEnabled && (
          <View style={style.menuItemContainer}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <SwitchTrackedByUser />
              </View>
              <View style={style.settingTextContainer}>
                <Text
                  style={style.textSettingName}
                >
                  {t('settingsView.switchTrackedBySubject')}
                </Text>
              </View>
              <Switch
                style={style.switchSetting}
                trackColor={
                  { false: COLORS_LIGHT.G5_LightGreyLines, true: COLORS_LIGHT.blueLight }
                }
                thumbColor={
                  isSwitchTrackBySubjectEnabled
                    ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G3_secondaryMediumLightGray
                }
                onValueChange={toggleSwitchTrackedByUser}
                value={isSwitchTrackBySubjectEnabled}
              />
            </View>
          </View>
        )}
        {/* End Switch Tracked By Subject */}

        {/* Tracked By Subject */}
        {experimentalFeaturesEnabled && isSwitchTrackBySubjectEnabled && (
          <View style={style.menuItemContainer}>
            <Pressable onPress={() => {
              if (!isActivelyTracking) {
                navigation.navigate('SubjectsView');
              }
            }}
            >
              <View style={style.settingContainer}>
                <View style={style.settingIcon}>
                  <TrackByIcon />
                </View>
                <View style={style.textIcon}>
                  <Text
                    style={style.textSettingName}
                  >
                    {t('settingsView.trackedBy')}
                  </Text>
                  <Text
                    style={style.textSettingDescription}
                  >
                    {trackedBySubjectName || userNameValue}
                  </Text>
                </View>
                {!isActivelyTracking && (
                  <ChevronIcon />
                )}
              </View>
            </Pressable>
          </View>
        )}
        {/* End Tracked By Subject */}

        {/* Media */}
        <View style={style.labelContainer}>
          <Text label>{t('settingsView.media')}</Text>
        </View>
        {/* End Media */}

        {/* Photo Quality */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => {
            navigation.navigate('PhotoQualityView');
          }}
          >
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <ImageIcon color={COLORS_LIGHT.G2_5_mobileSecondaryGray} width="18" height="18" />
              </View>
              <View style={style.textIconSecondary}>
                <Text style={style.textSettingName} color={COLORS_LIGHT.G0_black}>{t('settingsView.photoQuality')}</Text>
                <Text caption color={COLORS_LIGHT.G2_secondaryMediumGray}>
                  {getPhotoQualityString[photoQuality as QualityType]}
                </Text>
              </View>
              <ChevronIcon />
            </View>
          </Pressable>
        </View>
        {/* End Photo Quality */}

        {/* Save to Camera Roll */}
        <View style={style.menuItemContainer}>
          <View style={style.settingContainer}>
            <View style={style.settingIcon}>
              <CameraRollIcon />
            </View>
            <View style={style.settingTextContainer}>
              <Text
                style={style.textSettingName}
              >
                {t('settingsView.saveToCameraRoll')}
              </Text>
            </View>
            <Switch
              style={style.switchSetting}
              trackColor={
                { false: COLORS_LIGHT.G5_LightGreyLines, true: COLORS_LIGHT.blueLight }
              }
              thumbColor={
                isSaveToCameraRollEnabled
                  ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G3_secondaryMediumLightGray
              }
              value={isSaveToCameraRollEnabled}
              onValueChange={() => {
                setIsSaveToCameraRollEnabled(!isSaveToCameraRollEnabled);
                setBoolForKey(SAVE_TO_CAMERA_ROLL, !isSaveToCameraRollEnabled);
              }}
            />
          </View>
        </View>
        {/* End Save to Camera Roll */}

        {/* Upload Photos with Wifi */}
        <View style={style.menuItemContainer}>
          <View style={style.settingContainer}>
            <View style={style.settingIcon}>
              <WiFiIcon />
            </View>
            <View style={style.settingTextContainer}>
              <Text
                style={style.textSettingName}
              >
                {t('settingsView.uploadPhotosWithWifi')}
              </Text>
            </View>
            <Switch
              style={style.switchSetting}
              trackColor={
                { false: COLORS_LIGHT.G5_LightGreyLines, true: COLORS_LIGHT.blueLight }
              }
              thumbColor={
                isUploadPhotosWifiEnabled
                  ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G3_secondaryMediumLightGray
              }
              value={isUploadPhotosWifiEnabled}
              onValueChange={() => {
                setIsUploadPhotosWifiEnabled(!isUploadPhotosWifiEnabled);
                setBoolForKey(UPLOAD_PHOTOS_WIFI, !isUploadPhotosWifiEnabled);
              }}
            />
          </View>
        </View>
        {/* End Upload Photos with Wifi */}

        {/* Category Label */}
        <View style={style.labelContainer}>
          <Text label>{t('settingsView.display')}</Text>
        </View>
        {/* End Category Label */}

        {/* Dark Mode */}
        {experimentalFeaturesEnabled && (
          <View style={style.menuItemContainer}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <DarkModeIcon />
              </View>
              <View style={style.settingTextContainer}>
                <Text
                  style={style.textSettingName}
                >
                  {t('settingsView.darkMode')}
                </Text>
              </View>
              <Switch
                style={style.switchSetting}
                trackColor={
                  { false: COLORS_LIGHT.G5_LightGreyLines, true: COLORS_LIGHT.blueLight }
                }
                thumbColor={
                  COLORS_LIGHT.G3_secondaryMediumLightGray
                }
              />
            </View>
          </View>
        )}
        {/* End Switch Dark Mode */}

        {/* Basemap */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => {
            if (isDeviceOnline) {
              navigation.navigate('BasemapView');
            }
          }}
          >
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <LayersIcon color={COLORS_LIGHT.G2_5_mobileSecondaryGray} />
              </View>
              <View style={style.textIconSecondary}>
                <Text style={style.textSettingName}>{t('settingsView.basemap')}</Text>
                <Text style={style.textSettingDescription}>
                  {t(`mapTrackLocation.${basemapName}`)}
                </Text>
              </View>
              {isDeviceOnline && (
                <ChevronIcon />
              )}
            </View>
          </Pressable>
        </View>
        {/* End Basemap */}

        {/* Coordinates */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => navigation.navigate('CoordinateUnitsView')}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <CoordinatesIcon />
              </View>
              <View style={style.textIconSecondary}>
                <Text style={style.textSettingName}>{t('settingsView.coordinates')}</Text>
                <Text style={style.textSettingDescription}>
                  {coordinatesFormat}
                </Text>
              </View>
              <ChevronIcon />
            </View>
          </Pressable>
        </View>
        {/* End Coordinates */}

        {/* Category Label */}
        <View style={style.labelContainer}>
          <Text label>{t('menuSettingsView.about')}</Text>
        </View>
        {/* End Category Label */}

        {/* Privacy Policy */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => openURLInBrowser(t('aboutView.urlPrivacyPolicy'))}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <PrivacyPolicyIcon />
              </View>
              <Text style={style.textIcon}>{t('aboutView.privacyPolicy')}</Text>
              {isDeviceOnline && <ChevronIcon />}
            </View>
          </Pressable>
        </View>
        {/* End Privacy Policy */}

        {/* End User License Agreement */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => openURLInBrowser(t('aboutView.urlEndUserLicenseAgreement'))}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <EndUserAgreementIcon />
              </View>
              <Text style={style.textIcon}>{t('aboutView.endUserLicenseAgreement')}</Text>
              {isDeviceOnline && <ChevronIcon />}
            </View>
          </Pressable>
        </View>
        {/* End End User License Agreement */}

        {/* Report an Issue */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => {
            if (isDeviceOnline) {
              trackAnalyticsEvent(createReportIssueSelectedEvent());
              navigation.navigate('ReportIssueView');
            }
          }}
          >
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <ReportAnIssueIcon />
              </View>
              <Text style={style.textIcon}>{t('aboutView.reportIssue')}</Text>
              {isDeviceOnline && <ChevronIcon />}
            </View>
          </Pressable>
        </View>
        {/* End Report an Issue */}

        {/* Help Center */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => openURLInBrowser(t('aboutView.urlHelpCenter'))}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <HelpCenterIcon />
              </View>
              <Text style={style.textIcon}>{t('aboutView.helpCenter')}</Text>
              {isDeviceOnline && <ChevronIcon />}
            </View>
          </Pressable>
        </View>
        {/* Help center */}

        {/* Reset Database Cache */}
        {experimentalFeaturesEnabled && isLoginUser && (
        <View style={style.menuItemContainer}>
          <Pressable onPress={() => navigation.navigate('ResetDatabaseCacheView')}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <DatabaseIcon />
              </View>
              <Text style={style.textIcon}>{t('aboutView.resetDatabaseCache')}</Text>
              <ChevronIcon />
            </View>
          </Pressable>
        </View>
        )}
        {/* End Reset Database Cache */}

        {/* Category Label */}
        <View style={style.labelContainer}>
          <Text label>{t('settingsView.account')}</Text>
        </View>
        {/* End Category Label */}

        {/* Site Name */}
        <View style={style.menuItemContainer}>
          <Pressable onPress={siteNameTapped}>
            <View style={style.settingContainer}>
              <View style={style.settingIcon}>
                <EarthRangerSiteIcon />
              </View>
              <View style={style.textIconSecondary}>
                <Text style={style.textSettingName}>{t('settingsView.siteName')}</Text>
                <Text style={style.textSettingDescription}>{siteValue}</Text>
              </View>
            </View>
          </Pressable>
        </View>
        {/* End Site Name */}

        {/* Log Out */}
        {(isLoginUser) && (
          <View style={style.menuItemContainer}>
            <Pressable onPress={() => onLogoutPressed()}>
              <View style={style.settingContainer}>
                <View style={style.settingIcon}>
                  <LogOutIcon />
                </View>
                <Text style={style.textBold}>{t('settingsView.logOut')}</Text>
              </View>
            </Pressable>
          </View>
        )}
        {/* End Log Out */}

        {/* Experimental Features */}
        {experimentalFeaturesEnabled && (
          <>
            {/* Category Label */}
            <View style={style.labelContainer}>
              <Text label>{t('settingsView.testing')}</Text>
            </View>
            {/* End Category Label */}

            {/* Experimental Features */}
            <View style={style.menuItemContainer}>
              <View style={style.settingContainer}>
                <View style={style.settingIcon}>
                  <MergeCategoriesIcon />
                </View>
                <View style={style.settingTextContainer}>
                  <Text
                    style={style.textSettingName}
                    numberOfLines={2}
                  >
                    {t('settingsView.experimentalFeatures')}
                  </Text>
                  <Text
                    style={style.textSettingDescription}
                    numberOfLines={2}
                  >
                    {t('settingsView.experimentalFeaturesDescription')}
                  </Text>
                </View>
                <Switch
                  style={style.switchSetting}
                  trackColor={{
                    false: COLORS_LIGHT.G5_LightGreyLines,
                    true: COLORS_LIGHT.blueLight,
                  }}
                  thumbColor={
                    experimentalFeaturesEnabled
                      ? COLORS_LIGHT.brightBlue : COLORS_LIGHT.G3_secondaryMediumLightGray
                  }
                  onValueChange={() => toggleExperimentalFeatures()}
                  value={experimentalFeaturesEnabled}
                />
              </View>
            </View>
          </>
        )}
        {/* End Experimental Features */}

        <View style={style.line} />

        {/* App version & development information */}
        <Text style={style.textVersion}>{t(`v.${version}+${buildNum}`)}</Text>
        <Text style={style.textDeveloped}>
          {t('aboutView.developedInPartnershipWith')}
          <Text
            style={style.textTheMara}
            onPress={() => openURLInBrowser(t('aboutView.urlTheMaraElephantProject'))}
          >
            {t('aboutView.theMaraElephantProject')}
          </Text>
        </Text>
        {/* End App version & development information */}

        <CustomAlert
          displayAlert={showAlertDialog}
          alertIcon={<LogOutAlertIcon />}
          alertTitleText={t('settingsView.dataConnectionAlert.title')}
          alertMessageText={t('settingsView.dataConnectionAlert.message')}
          positiveButtonText={t('settingsView.dataConnectionAlert.positiveAction')}
          negativeButtonText={t('settingsView.dataConnectionAlert.negativeAction')}
          onPositiveButtonPress={async () => {
            trackAnalyticsEvent(createConfirmLogoutEvent());
            await onLogout();
            if (!getBoolForKey(REMEMBER_ME_CHECKBOX_KEY)) {
              setSecuredStringForKey(USER_NAME_KEY, '');
            }
            setSecuredStringForKey(ACTIVE_USER_NAME_KEY, '');
            setShowAlertDialog(false);
          }}
          onNegativeButtonPress={() => setShowAlertDialog(false)}
          positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_RED}
        />
        <CustomAlert
          displayAlert={showAlertDialogPendingSync}
          alertIcon={<LogOutAlertIcon />}
          alertTitleText={t('settingsView.pendingSyncAlert.title')}
          alertMessageText={t('settingsView.pendingSyncAlert.message')}
          positiveButtonText={t('settingsView.pendingSyncAlert.positiveAction')}
          negativeButtonText={t('settingsView.pendingSyncAlert.negativeAction')}
          onPositiveButtonPress={() => {
            trackAnalyticsEvent(createConfirmLogoutPendingSyncEvent());
            onLogout();
            setShowAlertDialogPendingSync(false);
          }}
          onNegativeButtonPress={() => setShowAlertDialogPendingSync(false)}
          positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_RED}
        />

        {/* Prevent from logging out when tracking */}
        <CustomAlert
          displayAlert={showAlertTrackingDialog}
          alertIcon={<ArrowDisabledIcon />}
          alertTitleText={t('settingsView.activeTrackingAlert.title')}
          alertMessageText={t('settingsView.activeTrackingAlert.message')}
          positiveButtonText={t('common.ok')}
          onPositiveButtonPress={() => setShowAlertTrackingDialog(false)}
          positiveButtonBackgroundColor={COLORS_LIGHT.brightBlue}
        />
        {/* End Prevent from logging out when tracking */}

        {/* Switch User Error */}
        <CustomAlert
          displayAlert={showAlertDialogSwitchUser}
          alertIcon={<ArrowDisabledIcon />}
          alertTitleText={t('settingsView.switchActiveUserAlert.title')}
          alertMessageText={t('settingsView.switchActiveUserAlert.message')}
          positiveButtonText={t('settingsView.switchActiveUserAlert.positiveAction')}
          onPositiveButtonPress={() => {
            setShowAlertDialogSwitchUser(false);
          }}
          positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
        />
        {/* End Switch User Error */}
      </ScrollView>
    </SafeAreaView>
  );
};
