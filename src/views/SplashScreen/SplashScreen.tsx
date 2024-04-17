/* eslint-disable no-await-in-loop */
// External Dependencies
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Image, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isEmpty } from 'lodash-es';
import { useMMKVString } from 'react-native-mmkv';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-ui-lib';

// Internal Dependencies
import NetInfo from '@react-native-community/netinfo';
import {
  ACTIVE_USER_HAS_PATROLS_PERMISSION,
  ACTIVE_USER_NAME_KEY,
  COORDINATES_FORMAT_KEY,
  CURRENT_MENU_SETTINGS_TAB,
  LOCAL_DB_SYNCING,
  PARENT_USER_REMOTE_ID_KEY,
  PATROLS_SYNCING,
  PHOTO_QUALITY_KEY,
  REPORTS_SYNCING,
  SHOW_USER_TRAILS_ENABLED_KEY,
  SITE_VALUE_KEY,
  USER_NAME_KEY,
  USER_REMOTE_ID_KEY,
} from '../../common/constants/constants';
import {
  getBoolForKey, getStringForKey, setBoolForKey, setStringForKey,
} from '../../common/data/storage/keyValue';
import { icons } from '../../ui/AssetsUtils';
import log, { initLogs, removeOldLogFiles } from '../../common/utils/logUtils';
import { logScreenView } from '../../analytics/wrapper/analyticsWrapper';
import { screenViewEventToHashMap } from '../../analytics/model/analyticsScreenView';
import createScreenViewEvent from '../screenViewTracker/screenViewTracker';
import { SPLASH_SCREEN_SCREEN } from '../../analytics/model/constantsScreens';
import {
  getSchemaVersion,
  getSyncState,
  needsUpgrade,
  onUpgrade,
} from '../../common/data/PersistentStore';
import { RootStackParamList } from '../../common/types/types';
import { getSession } from '../../common/data/storage/session';
import { SCHEMA_VERSION } from '../../common/data/sql/tables';
import { usePopulateUsers } from '../../common/data/users/usePopulateUsers';
import { getSyncStateScope, SyncScope, useOnSynchronizeData } from '../../api/SyncService';
import { useSyncState } from '../../common/data/hooks/useSyncState';
import { COLORS_LIGHT } from '../../common/constants/colors';
import { setSafeAreaInsets } from '../../common/utils/safeAreaInsets';
import { getSecuredStringForKey, setSecuredStringForKey } from '../../common/data/storage/utils';
import { useRefreshToken } from '../../common/utils/useRefreshToken';
import { LocationFormats } from '../../common/utils/locationUtils';
import { getAuthState, isParentUserActive, setAuthState } from '../../common/utils/authUtils';
import { AuthState, Permissions } from '../../common/enums/enums';
import { deleteSession } from '../../common/utils/deleteSession';
import { isEmptyString } from '../../common/utils/stringUtils';
import { useRetrievePatrolPermissions } from '../../common/data/permissions/useRetrievePermissions';
import { QualityType } from '../../common/utils/imageUtils';

// Styles
import { styles } from './style';

// Constants
const VIEW_NAME = 'SplashScreen';

// Interfaces
interface SplashScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SplashScreen'>;
}

export const SplashScreen = ({
  navigation,
}: SplashScreenProps) => {
  // Hooks
  const { t } = useTranslation();
  const { updateAuthState, checkIfParentUserPinIsSet } = usePopulateUsers();
  const { insertSyncState, updateSyncState } = useSyncState();
  const {
    onSynchronizeUser,
    onSynchronizeProfiles,
    onSynchronizeEventsCategories,
    onSynchronizeEventsTypes,
    onSyncPatrolTypes,
  } = useOnSynchronizeData();
  const { handleRefreshToken } = useRefreshToken();
  const insets = useSafeAreaInsets();
  const { isPermissionAvailable } = useRetrievePatrolPermissions();

  // Component's State
  const [showLoaderView, setShowLoaderView] = useState(false);
  const isSyncing = useRef(false);
  const sessionToken = useRef(getSession()?.access_token || '');
  const [accessToken, setAccessToken] = useMMKVString('access_token');
  const [statusMessage, setStatusMessage] = useState('');

  // Component's Life-cycle
  useEffect(() => {
    const init = async () => {
      try {
        setBoolForKey(REPORTS_SYNCING, false);
        setBoolForKey(PATROLS_SYNCING, false);
        setBoolForKey(LOCAL_DB_SYNCING, false);
        await initLogs();
        await removeOldLogFiles();
        await trackScreenView();
        await setupData();
        log.debug(`${VIEW_NAME} :: init app`);
      } catch (error) {
        log.error(`${VIEW_NAME} :: could not init app`, error);
      } finally {
        setSafeAreaInsets(insets);
        setBoolForKey(SHOW_USER_TRAILS_ENABLED_KEY, true);
        setStringForKey(CURRENT_MENU_SETTINGS_TAB, 'status');
        if (!getStringForKey(COORDINATES_FORMAT_KEY)) {
          setStringForKey(COORDINATES_FORMAT_KEY, LocationFormats.DEG);
        }
        if (!getStringForKey(PHOTO_QUALITY_KEY)) {
          setStringForKey(PHOTO_QUALITY_KEY, QualityType.MEDIUM);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    async function syncAsync() {
      if (isSyncing.current) {
        isSyncing.current = false;
        if (accessToken) {
          await checkSyncState(accessToken);

          if (!isSyncing.current) {
            navigateTo('MainTabBar');
          }
        }
      }
    }
    syncAsync();
  }, [accessToken]);

  // Utility functions
  const refreshToken = async () => {
    const isTokenRefreshed = await handleRefreshToken(navigation);
    if (isTokenRefreshed) {
      setAccessToken(getSession()?.access_token);
    }
  };

  const setupData = async () => {
    const schemaVersion = await getSchemaVersion();
    log.info(`DB Schema version = ${schemaVersion}`);

    if (await needsUpgrade(SCHEMA_VERSION)) {
      await onUpgrade(SCHEMA_VERSION);
      if (SCHEMA_VERSION as number === 26) {
        const userId = getSecuredStringForKey(USER_REMOTE_ID_KEY);
        if (!isEmptyString(userId) && userId !== undefined) {
          setSecuredStringForKey(PARENT_USER_REMOTE_ID_KEY, userId);
        } else {
          await deleteSession();
          setAuthState(AuthState.unknown);
          navigateTo('LoginView');
        }
      }
    }

    if (sessionToken.current) {
      log.info(`Site: ${getSecuredStringForKey(SITE_VALUE_KEY)}`);
      const userName = getSecuredStringForKey(USER_NAME_KEY);
      log.info(`Username: ${userName}`);
      if (userName && isEmptyString(getSecuredStringForKey(ACTIVE_USER_NAME_KEY))) {
        setSecuredStringForKey(ACTIVE_USER_NAME_KEY, userName);
      }
      log.info(`Active User: ${getSecuredStringForKey(ACTIVE_USER_NAME_KEY)}`);

      const state = await NetInfo.fetch();
      if (state.isConnected) {
        await checkSyncState(sessionToken.current);
      }

      if (!getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION)) {
        const isPatrolPermissionAvailable = await isPermissionAvailable(Permissions.patrol);
        setBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION, isPatrolPermissionAvailable);
      }

      await updateAuthState();
      const authState = getAuthState();

      if (!isSyncing.current) {
        switch (authState) {
          case AuthState.userInvalidated:
          case AuthState.authInvalidated: {
            const pinAvailable = await checkIfParentUserPinIsSet();
            if (pinAvailable && isParentUserActive()) {
              setAuthState(AuthState.authenticated);
              navigateTo('MainTabBar');
            } else {
              navigateTo('PinAuthenticationView');
            }
            break;
          }
          case AuthState.authenticated:
          case AuthState.notRequired:
            navigateTo('MainTabBar');
            break;
          case AuthState.required:
            navigateTo('PinAuthenticationView');
            break;
          default:
            await deleteSession();
            setAuthState(AuthState.unknown);
            navigateTo('LoginView');
        }
      }
    } else {
      navigateTo('LoginView');
    }
  };

  const getSyncMessage = (scope: SyncScope) => {
    switch (scope) {
      case SyncScope.Users:
      case SyncScope.Profiles:
        return t('splashScreen.syncingUser');
      case SyncScope.PatrolTypes:
        return t('splashScreen.syncingPatrolTypes');
      case SyncScope.EventTypes:
        return t('splashScreen.syncingTypesOfReports');
      case SyncScope.Schema:
        return t('splashScreen.syncingReportCategories');
      default:
        return '';
    }
  };

  const checkSyncState = async (token: string) => {
    isSyncing.current = true;
    setShowLoaderView(true);
    // check sync state

    // eslint-disable-next-line no-restricted-syntax
    for (const syncScope of Object.values(SyncScope)) {
      const eTag = await getSyncStateScope(token, syncScope);
      if (eTag === '401') {
        await refreshToken();
        return;
      }
      if (eTag !== '500') {
        const scope = eTag.toString().replace(/["[^W/]*"+/g, '');
        log.info(`[Scope]: ${scope}`);

        const state = await getSyncState(syncScope);

        if (state === -1) {
          log.info(`[State] ${syncScope} : no local state defined`);
          await insertSyncState(syncScope, scope, scope);
          switch (syncScope) {
            case SyncScope.Users:
              await syncResource(SyncScope.Users, sessionToken.current);
              break;
            case SyncScope.PatrolTypes:
              await syncResource(SyncScope.PatrolTypes, sessionToken.current);
              break;
            default:
              break;
          }
          isSyncing.current = false;
        } else {
          log.info(`[State] ${syncScope} : ${state}`);

          if (state !== scope) {
            setStatusMessage(getSyncMessage(syncScope));
            const authError = await syncResource(syncScope, token);
            if (isEmpty(authError)) {
              await updateSyncState(syncScope, scope);
              isSyncing.current = false;
            } else {
              await refreshToken();
            }
          } else if (syncScope === SyncScope.Users || syncScope === SyncScope.Profiles) {
            await syncResource(SyncScope.Users, sessionToken.current);
            await syncResource(SyncScope.Profiles, sessionToken.current);
            isSyncing.current = false;
          }
        }
      }
    }

    setStatusMessage('');
    isSyncing.current = false;
  };

  const syncResource = async (syncScope: SyncScope, token: string) => {
    switch (syncScope) {
      case SyncScope.EventTypes:
        await onSynchronizeEventsCategories(token);
        return onSynchronizeEventsTypes(token);
      case SyncScope.Users:
        return onSynchronizeUser(token);
      case SyncScope.Profiles:
        return onSynchronizeProfiles(token);
      case SyncScope.PatrolTypes:
        return onSyncPatrolTypes(token);
      default:
        return '';
    }
  };

  const navigateTo = (name: string) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name }],
    }));
  };

  const trackScreenView = async () => {
    await logScreenView(screenViewEventToHashMap(
      createScreenViewEvent(SPLASH_SCREEN_SCREEN, SPLASH_SCREEN_SCREEN),
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image style={styles.logo} source={icons.LoginView.loginLogo} />
        <Text bodySmall style={styles.statusMessage}>{statusMessage}</Text>
        <ActivityIndicator
          style={{ marginTop: 28 }}
          animating={showLoaderView}
          color={COLORS_LIGHT.erTeal}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};
