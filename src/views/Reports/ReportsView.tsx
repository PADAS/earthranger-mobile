// External Dependencies
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useMMKVBoolean, useMMKVNumber } from 'react-native-mmkv';

// Internal Dependencies
import { AddEventButton } from '../../common/components/AddEventButton/AddEventButton';
import {
  IS_STATUS_FILTER_DRAFT_SELECTED,
  IS_STATUS_FILTER_PENDING_SELECTED,
  IS_STATUS_FILTER_SYNCED_SELECTED,
  MERGE_CATEGORIES_KEY,
  REPORTS_SUBMITTED_KEY,
  REPORTS_SYNCING,
  SESSION_KEY,
} from '../../common/constants/constants';
import { Position, RootStackParamList } from '../../common/types/types';
import {
  getBoolForKey,
  localStorage,
} from '../../common/data/storage/keyValue';
import {
  useRetrieveReportPendingSync,
} from '../../common/data/reports/useRetrieveReportPendingSync';
import { useUploadReports } from '../../common/data/reports/useUploadReports';
import {
  getSession,
} from '../../common/data/storage/session';
import { isInternetReachable } from '../../common/utils/NetworkInfoUtils';
import { getMapUserPosition } from '../../common/utils/locationUtils';
import { useRefreshToken } from '../../common/utils/useRefreshToken';
import { localStorageSecured } from '../../common/data/storage/utils';
import { ApiStatus } from '../../common/types/apiModels';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../analytics/model/analyticsEvent';
import { logEvent } from '../../analytics/wrapper/analyticsWrapper';
import { addReportEvent } from '../../analytics/reports/reportsAnalytics';
import { isSyncingReports } from '../../common/utils/syncUtils';
import { EventsList } from './components/EventsList/EventsList';

// Styles
import styles from './ReportsView.styles';

// Interfaces + Types
interface ReportsViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportsView'>;
}

const ReportsView = ({
  navigation,
}: ReportsViewProps) => {
  // Hooks
  const { retrieveReportPendingSyncCount } = useRetrieveReportPendingSync();
  const { uploadReportAndAttachments } = useUploadReports();
  const { handleRefreshToken } = useRefreshToken();

  // Components Reference
  const isUploadAllowed = useRef(true);
  const accessToken = useRef(getSession()?.access_token || '');

  // Component's State
  const [reportSyncStatusChanged] = useMMKVBoolean(REPORTS_SYNCING, localStorage);
  const [pendingSyncCount, setPendingSyncCount] = useState(-1);
  const [reportsSubmittedCount, setReportsSubmittedCount] = useMMKVNumber(
    REPORTS_SUBMITTED_KEY,
    localStorage,
  );

  useFocusEffect(useCallback(() => {
    async function syncStatusReportsAsync() {
      const internetAvailable = await isInternetReachable();
      if (!internetAvailable) {
        return;
      }
      if (isUploadAllowed.current && !isSyncingReports()) {
        isUploadAllowed.current = false;
        await syncStatusReports();
        isUploadAllowed.current = true;
      }
    }

    updateDashboard();

    if (pendingSyncCount > 0) {
      syncStatusReportsAsync();
    }
  }, [
    accessToken.current,
    pendingSyncCount,
    getBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED),
    getBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED),
    getBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED),
  ]));

  useEffect(() => {
    if (!isSyncingReports()) {
      updateDashboard();
    }
  }, [reportSyncStatusChanged]);

  useEffect(() => {
    const valueChangeListener = localStorageSecured.addOnValueChangedListener((key: string) => {
      if (key === SESSION_KEY) {
        accessToken.current = getSession()?.access_token || '';
      }
    });

    return () => {
      valueChangeListener.remove();
    };
  }, []);

  const updateDashboard = async () => {
    await getPendingSyncCount();
  };

  const syncStatusReports = async () => {
    const response = await uploadReportAndAttachments();

    if (response.reportStatus === ApiStatus.Unauthorized
      || response.attachmentStatus === ApiStatus.Unauthorized) {
      await handleRefreshToken(navigation);
    } else if (response.reportStatus === ApiStatus.Succeeded
      || response.attachmentStatus === ApiStatus.Succeeded) {
      setReportsSubmittedCount(reportsSubmittedCount + pendingSyncCount);
      await getPendingSyncCount();
    }
  };

  // Handlers
  const onPressHandler = () => {
    trackAnalyticsEvent(addReportEvent());
    if (getBoolForKey(MERGE_CATEGORIES_KEY)) {
      navigation.navigate('ReportTypesView', {
        title: '',
        categoryId: '',
        coordinates: getMapUserPosition() as Position,
      });
    } else {
      navigation.navigate('ReportCategoriesView', { coordinates: getMapUserPosition() as Position });
    }
  };

  // Utility Functions
  const getPendingSyncCount = async () => {
    const count = await retrieveReportPendingSyncCount();
    setPendingSyncCount(count);
  };

  const trackAnalyticsEvent = useCallback(async (event: AnalyticsEvent) => {
    await logEvent(event.eventName, analyticsEventToHashMap(event));
  }, []);

  return (
    <SafeAreaView style={styles.containerSafeArea} edges={['bottom']}>
      {/* Main Container */}
      <EventsList
        navigation={navigation}
      />

      <View style={styles.addReportButton}>
        <AddEventButton onPress={onPressHandler} />
      </View>
      {/* End Main Container */}
    </SafeAreaView>
  );
};

export { ReportsView };
