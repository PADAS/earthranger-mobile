/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
// External Dependencies
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { Pressable, View } from 'react-native';
import { HttpEvent } from 'react-native-background-geolocation';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isEmpty } from 'lodash-es';
import { Button, Incubator } from 'react-native-ui-lib';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Internal Dependencies
import { useMMKVBoolean, useMMKVNumber } from 'react-native-mmkv';
import { logSync, logTracking } from '../../common/utils/logUtils';
import {
  ACTIVE_USER_HAS_PATROLS_PERMISSION,
  ALERT_BUTTON_BACKGROUND_COLOR_BLUE,
  DATE_FORMAT_HHMM_DD_MMM_YYYY,
  LAST_SYNC_LOCATION_TIME_KEY,
  LAST_SYNC_PATROLS_TIME_KEY,
  LAST_SYNC_REPORTS_TIME_KEY,
  LAST_SYNC_SUBJECTS_TIME,
  PATROLS_SYNCING,
  REPORTS_SUBMITTED_KEY,
  REPORTS_SYNCING,
  UPDATE_PATROL_TYPES_UI,
} from '../../common/constants/constants';
import {
  getBoolForKey,
  getStringForKey, localStorage, setBoolForKey, setStringForKey,
} from '../../common/data/storage/keyValue';
import BackgroundLocation from '../../common/backgrounGeolocation/BackgroundLocation';
import { syncPendingObservations } from '../../common/utils/trackingUtils';
import { DetailedInfoCard } from '../../common/components/DetailedInfoCard/DetailedInfoCard';
import { useRetrieveReportPendingSync } from '../../common/data/reports/useRetrieveReportPendingSync';
import { ReportsInfoIcon } from '../../common/icons/ReportsInfoIcon';
import { CustomAlert } from '../../common/components/CustomAlert/CustomAlert';
import { useRetrievePendingSyncPatrol } from '../../common/data/patrols/useRetrievePendingSyncPatrol';
import { useRetrieveSyncedPatrol } from '../../common/data/patrols/useRetrieveSyncedPatrol';
import { getSession } from '../../common/data/storage/session';
import { useUploadReports } from '../../common/data/reports/useUploadReports';
import { useRefreshToken } from '../../common/utils/useRefreshToken';
import { useUploadPatrols } from '../../common/data/patrols/useUploadPatrols';
import { isInternetReachable } from '../../common/utils/NetworkInfoUtils';
import { ApiStatus } from '../../common/types/apiModels';
import { isExpiredTokenStatus } from '../../common/utils/errorUtils';
import { SyncIcon } from '../../common/icons/SyncIcon';
import { getSyncStateScope, SyncScope, useOnSynchronizeData } from '../../api/SyncService';
import { getSyncState } from '../../common/data/PersistentStore';
import { useSyncState } from '../../common/data/hooks/useSyncState';
import { COLORS_LIGHT } from '../../common/constants/colors';
import { RootStackParamList } from '../../common/types/types';
import { getAuthState, isParentUserActive, setAuthState } from '../../common/utils/authUtils';
import { AuthState, Permissions } from '../../common/enums/enums';
import { usePopulateUsers } from '../../common/data/users/usePopulateUsers';
import { deleteSession } from '../../common/utils/deleteSession';
import { useRetrievePatrolPermissions } from '../../common/data/permissions/useRetrievePermissions';

// Style
import styles from './StatusView.styles';

// Constants
const VIEW_NAME = 'StatusView';

// Interfaces + Types
interface StatusViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StatusView'>;
}

export const StatusView = ({ navigation }: StatusViewProps) => {
  // Hooks
  const { t } = useTranslation();
  const { retrieveReportPendingSyncCount } = useRetrieveReportPendingSync();
  const { retrievePendingSyncPatrolsCount } = useRetrievePendingSyncPatrol();
  const { retrieveSyncedPatrol } = useRetrieveSyncedPatrol();
  const { uploadReportAndAttachments } = useUploadReports();
  const { uploadPatrols } = useUploadPatrols();
  const { handleRefreshToken } = useRefreshToken();
  const { updateAuthState, checkIfParentUserPinIsSet } = usePopulateUsers();
  const {
    onSynchronizeUser,
    onSynchronizeProfiles,
    onSynchronizeEventsCategories,
    onSynchronizeEventsTypes,
    onSyncPatrolTypes,
    onSyncSubjects,
  } = useOnSynchronizeData();
  const { updateSyncState } = useSyncState();
  const { isPermissionAvailable } = useRetrievePatrolPermissions();

  // Component's State
  const syncIcon = useMemo(() => (<SyncIcon />), []);
  const [observationsSyncing, setObservationsSyncing] = useState(false);
  const [isPatrolSyncing] = useMMKVBoolean(PATROLS_SYNCING, localStorage);
  const [isReportSyncing] = useMMKVBoolean(REPORTS_SYNCING, localStorage);
  const [displayInternetConnectionError, setDisplayInternetConnectionError] = useState(false);
  const [infoAlertVisible, setInfoAlertVisible] = useState(false);
  const [syncButtonDisabled, setSyncButtonDisabled] = useState(false);
  const [isForbiddenAlertVisible, setIsForbiddenAlertVisible] = useState(false);

  // Submitted this session
  const [reportsSubmitted, setReportsSubmitted] = useMMKVNumber(
    REPORTS_SUBMITTED_KEY,
    localStorage,
  );
  const [patrolsSubmitted, setPatrolsSubmitted] = useState(0);

  // Pending Sync
  const [pendingTrackPointsCount, setPendingTrackPointsCount] = useState(0);
  const [reportsPendingSyncCount, setReportsPendingSyncCount] = useState(0);
  const [patrolsPendingSyncCount, setPatrolsPendingSyncCount] = useState(0);

  // Last Sync
  const [lastSyncValue, setLastSync] = useState<string>(
    getStringForKey(LAST_SYNC_LOCATION_TIME_KEY) || t('statusView.defaultPendingSync'),
  );
  const [lastSyncedReport, setLastSyncedReport] = useState(getStringForKey(LAST_SYNC_REPORTS_TIME_KEY) || '');
  const [lastSyncedPatrol, setLastSyncedPatrol] = useState(getStringForKey(LAST_SYNC_PATROLS_TIME_KEY) || '');
  const [lastSyncedSubjects, setLastSyncedSubjects] = useState(getStringForKey(LAST_SYNC_SUBJECTS_TIME) || '');

  // Report errors
  const reportTypeErrors = useRef<string[]>([]).current;
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [reportTypeError, setReportTypeError] = useState('');

  // Handlers
  const onSync = async () => {
    setSyncButtonDisabled(true);
    if (!(await isInternetReachable())) {
      setDisplayInternetConnectionError(true);
      return;
    }

    const reportsPendingSync = await retrieveReportPendingSyncCount();

    try {
      const accessToken = getSession()?.access_token || '';
      // Sync Patrols
      if (getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION) && patrolsPendingSyncCount) {
        const apiStatus = await uploadPatrols(accessToken);
        if (isExpiredTokenStatus(apiStatus)) {
          await handleRefreshToken(navigation);
          return;
        }

        if (apiStatus === ApiStatus.Forbidden) {
          setIsForbiddenAlertVisible(true);
        }

        await updatePatrolsData();
      }

      // Sync Observations
      if (pendingTrackPointsCount) {
        setObservationsSyncing(true);
        await syncPendingObservations();
        await updatePendingTrackPoints();
        setObservationsSyncing(false);
      }

      // Sync Reports
      if (reportsPendingSync > 0) {
        const response = await uploadReportAndAttachments();

        if (response.reportStatus === ApiStatus.Unauthorized
          || response.attachmentStatus === ApiStatus.Unauthorized) {
          await handleRefreshToken(navigation);
          return;
        }
        if (response.reportStatus === ApiStatus.Succeeded
          || response.attachmentStatus === ApiStatus.Succeeded) {
          setStringForKey(LAST_SYNC_REPORTS_TIME_KEY, dayjs().format(DATE_FORMAT_HHMM_DD_MMM_YYYY));
          await updateReportsData();
          setReportsSubmitted(reportsSubmitted + reportsPendingSync);
        }
      }

      // Sync Local DB
      await handleSyncResources();
    } catch (error) {
      logSync.error(`[${VIEW_NAME}] :: Error uploading data [onSync] ${JSON.stringify(error)}`);
    }
    setSyncButtonDisabled(false);
  };

  useEffect(() => {
    navigation.setOptions({
      // @ts-ignore
      headerRight: () => syncButton(),
    });
  }, [syncButtonDisabled]);

  const syncButton = () => (
    <Button
      style={[syncButtonDisabled ? styles.syncButtonDisabled : null]}
      onPress={onSync}
      backgroundColor={COLORS_LIGHT.white}
      iconSource={() => syncIcon}
      label={t('statusView.sync')}
      labelStyle={styles.syncTextButton}
      disabled={syncButtonDisabled}
    />
  );

  const handleSyncResources = async () => {
    await syncResources();
  };

  const sync = async (resource: () => Promise<any>, errorMessage: string) => {
    const authError = await resource();
    if (!isEmpty(authError)) {
      logSync.error(`[${VIEW_NAME}] :: Error while downloading resource: ${errorMessage}`);
      return authError;
    }
    return null;
  };

  const syncResource = async (eTag: string, type: SyncScope, accessToken: string) => {
    const scope = eTag.toString().replace(/["[^W/]*"+/g, '');
    const state = await getSyncState(type);
    logSync.info(`[${VIEW_NAME}] :: ${type} :: scope ${scope} | state ${state}`);

    if (state !== scope) {
      const authErrors: string[] = [];

      switch (type) {
        case SyncScope.Users:
        case SyncScope.Profiles:
          authErrors.push(await sync(
            () => onSynchronizeUser(accessToken),
            'Auth error during onSynchronizeUser',
          ));
          if (isParentUserActive()) {
            authErrors.push(await sync(
              () => onSynchronizeProfiles(accessToken),
              'Auth error during onSynchronizeProfiles',
            ));
          }
          break;

        case SyncScope.EventTypes:
          authErrors.push(await sync(
            () => onSynchronizeEventsCategories(accessToken),
            'Auth error during onSynchronizeEventsCategories',
          ));
          authErrors.push(await sync(
            () => onSynchronizeEventsTypes(accessToken, onReportError),
            'Auth error during onSynchronizeEventsTypes',
          ));
          break;

        case SyncScope.PatrolTypes:
          if (getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION)) {
            authErrors.push(await sync(() => onSyncPatrolTypes(accessToken), 'Auth error during onSyncPatrolTypes'));
          }
          break;

        case SyncScope.Subjects:
          authErrors.push(await sync(() => onSyncSubjects(accessToken), 'Auth error during onSyncSubjects'));
          break;

        default:
          break;
      }

      if (authErrors.every((error) => isEmpty(error))) {
        // @TODO: Remove conditional as soon as server starts sending an eTag for Subjects
        if (type !== SyncScope.Subjects) {
          await updateSyncState(type, scope);
        }
        if (type === SyncScope.EventTypes) {
          saveLastSyncTimeReport();
        }
        if (type === SyncScope.Users || type === SyncScope.Profiles) {
          await updateAuthState();
        }

        setStringForKey(LAST_SYNC_SUBJECTS_TIME, dayjs().format(DATE_FORMAT_HHMM_DD_MMM_YYYY));
      } else {
        logSync.error(`[${VIEW_NAME}] :: Error updateSyncState ${authErrors}`);
      }
    }
  };

  const syncResources = async () => {
    // check sync state
    const accessToken = getSession()?.access_token || '';

    // eslint-disable-next-line no-restricted-syntax
    for (const syncScope of Object.values(SyncScope)) {
      const eTag = await getSyncStateScope(accessToken, syncScope);
      if (eTag === '401') {
        await handleRefreshToken(navigation);
        return;
      }
      if (eTag !== '500') {
        await syncResource(eTag, syncScope, accessToken);
        if (syncScope === SyncScope.PatrolTypes) {
          setBoolForKey(UPDATE_PATROL_TYPES_UI, true);
        }
        if (syncScope === SyncScope.Users || syncScope === SyncScope.Profiles) {
          const isPatrolPermissionAvailable = await isPermissionAvailable(Permissions.patrol);
          setBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION, isPatrolPermissionAvailable);
        }
        const authState = getAuthState();
        if (authState === AuthState.userInvalidated || authState === AuthState.authInvalidated) {
          const pinAvailable = await checkIfParentUserPinIsSet();
          if (pinAvailable) {
            if (isParentUserActive()) {
              setAuthState(AuthState.authenticated);
            } else {
              navigation.navigate('PinAuthenticationView');
            }
          } else {
            await deleteSession();
            setAuthState(AuthState.unknown);
            navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginView' }],
            }));
          }
        } else if (authState === AuthState.required) {
          setAuthState(AuthState.authenticated);
        }
      }
      // @TODO: To be replaced as soon as server returns an eTag for Subjects
      if (eTag === '500' && syncScope === SyncScope.Subjects) {
        await syncResource('NO_ETAG', syncScope, accessToken);
      }
    }
  };

  const onReportError = (reportType: string) => {
    if (reportTypeErrors.length === 0) {
      setReportTypeError(reportType);
      setIsToastVisible(true);
    } else {
      reportTypeErrors.push(reportType);
    }
  };

  // Utility Functions
  const updatePendingTrackPoints = async () => {
    const count = await BackgroundLocation.getCount();
    logTracking.info(`[${VIEW_NAME}] :: Pending observations: ${count}`);
    setPendingTrackPointsCount(count);
    // Hide previous (if any) pull-to-request error message
  };

  const saveLastSyncTimeReport = () => {
    const lastSyncDate = dayjs().format(DATE_FORMAT_HHMM_DD_MMM_YYYY);
    setStringForKey(LAST_SYNC_REPORTS_TIME_KEY, lastSyncDate);
  };

  const updateReportsData = async () => {
    setReportsPendingSyncCount(await retrieveReportPendingSyncCount());
    setLastSyncedReport(getStringForKey(LAST_SYNC_REPORTS_TIME_KEY) || '');
  };

  const updatePatrolsData = async () => {
    const patrolsListPendingSyncCount = await retrievePendingSyncPatrolsCount();
    setPatrolsPendingSyncCount(patrolsListPendingSyncCount);
    const patrolsListSynced = await retrieveSyncedPatrol();
    setPatrolsSubmitted(patrolsListSynced.length);
  };

  const updateLastSync = (response: HttpEvent): void => {
    if (response.status === 200 || response.status === 201) {
      const lastSyncDate = dayjs().format(DATE_FORMAT_HHMM_DD_MMM_YYYY);
      setLastSync(lastSyncDate);
      saveLastSyncValue(lastSyncDate);
    }
  };

  const initLastSyncValue = () => {
    const lastSync = getStringForKey(LAST_SYNC_LOCATION_TIME_KEY);
    if (lastSync) {
      setLastSync(lastSync);
    }
  };

  const saveLastSyncValue = (lastSync: string) => {
    setStringForKey(LAST_SYNC_LOCATION_TIME_KEY, lastSync);
  };

  // Component's Lifecycle
  useEffect(() => {
    // Last Sync Information
    initLastSyncValue();
    BackgroundLocation.onHttp((response) => {
      updateLastSync(response);
    });

    // Pending Sync Information
    async function initPendingTrackPoints() {
      await updatePendingTrackPoints();
    }
    initPendingTrackPoints();
    BackgroundLocation.onHttp(() => {
      updatePendingTrackPoints();
    });
    BackgroundLocation.onLocation(() => {
      updatePendingTrackPoints();
    });
  }, []);

  useEffect(() => {
    setSyncButtonDisabled(isReportSyncing);

    const updateReportsDataAsync = async () => {
      await updateReportsData();
    };
    if (!isReportSyncing) {
      updateReportsDataAsync();
    }
  }, [isReportSyncing]);

  useEffect(() => {
    const updatePatrolsDataAsync = async () => {
      await updatePatrolsData();
    };
    if (getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION) && !isPatrolSyncing) {
      updatePatrolsDataAsync();
    }
  }, [isPatrolSyncing]);

  useFocusEffect(() => {
    // Reports Information
    async function initInformation() {
      // Reports
      setReportsPendingSyncCount(await retrieveReportPendingSyncCount());

      // Patrols
      if (getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION)) {
        await updatePatrolsData();
      }
    }

    initInformation();
    setLastSyncedReport(getStringForKey(LAST_SYNC_REPORTS_TIME_KEY) || '');
    setLastSyncedPatrol(getStringForKey(LAST_SYNC_PATROLS_TIME_KEY) || '');
    setLastSyncedSubjects(getStringForKey(LAST_SYNC_SUBJECTS_TIME) || '');

    async function initReportsInformation() {
      await updateReportsData();
    }
    initReportsInformation();
  });

  const onDismissToast = () => {
    if (reportTypeErrors.length > 0) {
      setIsToastVisible(true);
      setReportTypeError(reportTypeErrors.pop() || '');
    } else {
      setIsToastVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Tracks */}
      <DetailedInfoCard
        title={t('statusView.tracks')}
        type="tracks"
        pendingSync={pendingTrackPointsCount.toString()}
        lastSync={lastSyncValue}
        syncing={observationsSyncing}
      />

      {/* Reports */}
      <DetailedInfoCard
        title={t('mainTabBar.events')}
        type="reports"
        pendingSync={reportsPendingSyncCount.toString()}
        uploaded={typeof reportsSubmitted === 'number' ? reportsSubmitted.toString() : '0'}
        lastSync={lastSyncedReport !== '' ? lastSyncedReport : t('statusView.defaultPendingSync')}
        syncing={isReportSyncing}
      />

      {/* Patrols */}
      {getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION) && (
        <DetailedInfoCard
          title={t('mapTrackLocation.patrols')}
          type="patrols"
          pendingSync={patrolsPendingSyncCount.toString()}
          uploaded={patrolsSubmitted.toString()}
          lastSync={lastSyncedPatrol !== '' ? lastSyncedPatrol : t('statusView.defaultPendingSync')}
          syncing={isPatrolSyncing}
        />
      )}

      {/* Subjects */}
      <DetailedInfoCard
        title={t('mainTabBar.subjects')}
        type="subjects"
        lastSync={lastSyncedSubjects !== '' ? lastSyncedSubjects : t('statusView.defaultPendingSync')}
        syncing={false}
      />

      <Pressable
        onPress={() => setInfoAlertVisible(true)}
        style={styles.infoCardInfoIcon}
        testID="StatusView-InfoIcon"
        hitSlop={5}
      >
        <View>
          <ReportsInfoIcon />
        </View>
      </Pressable>

      <CustomAlert
        displayAlert={infoAlertVisible}
        alertTitleText={t('statusView.syncAlertInfo.title')}
        alertMessageText={t('statusView.syncAlertInfo.message')}
        positiveButtonText={t('statusView.syncAlertInfo.positiveAction')}
        onPositiveButtonPress={() => {
          setInfoAlertVisible(false);
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />

      {/* Sync Error Message */}
      <CustomAlert
        displayAlert={displayInternetConnectionError}
        alertMessageText={t('statusView.noInternetConnection')}
        positiveButtonText={t('statusView.syncAlertInfo.positiveAction')}
        onPositiveButtonPress={() => {
          setDisplayInternetConnectionError(false);
          setSyncButtonDisabled(false);
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />
      {/* End Sync Error Message */}

      {/* Forbidden */}
      <CustomAlert
        displayAlert={isForbiddenAlertVisible}
        alertMessageText={t('mapTrackLocation.unauthorizedPatrolDialog.message')}
        positiveButtonText={t('mapTrackLocation.unauthorizedPatrolDialog.action')}
        onPositiveButtonPress={() => {
          setIsForbiddenAlertVisible(false);
        }}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />
      {/* End Forbidden */}

      {/* Report type sync error toast */}
      <Incubator.Toast
        autoDismiss={2000}
        backgroundColor={COLORS_LIGHT.G0_black}
        message={t('statusView.toastReportError.message', { reportType: reportTypeError })}
        messageStyle={{ color: COLORS_LIGHT.white }}
        onDismiss={onDismissToast}
        position="bottom"
        style={{ borderRadius: 0 }}
        visible={isToastVisible}
      />
      {/* End Report type sync error toast */}
    </SafeAreaView>
  );
};
