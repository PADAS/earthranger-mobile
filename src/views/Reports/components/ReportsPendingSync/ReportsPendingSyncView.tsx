// External Dependencies
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList, Pressable, SafeAreaView, ScrollView,
} from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Internal Dependencies
import { useRetrieveReportPendingSync } from '../../../../common/data/reports/useRetrieveReportPendingSync';
import { EventUploadDetails, Position, RootStackParamList } from '../../../../common/types/types';
import log from '../../../../common/utils/logUtils';
import { PendingEventStatus } from '../../../../common/utils/reportsPendingSyncUtils';
import { ReportsArrowIcon } from '../../../../common/icons/ReportArrowIcon';
import { getBoolForKey } from '../../../../common/data/storage/keyValue';
import { UPLOAD_PHOTOS_WIFI } from '../../../../common/constants/constants';

// Styles
import styles from './ReportsPendingSyncView.styles';

// Types + Interfaces
interface ReportsPendingSyncViewProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportsPendingSync'>;
}

const ReportsPendingSyncView = ({ navigation }: ReportsPendingSyncViewProps) => {
  // Hooks
  const { t } = useTranslation();
  const {
    retrieveReportsAndAttachmentsUploadStatus,
    retrieveReportPendingSync,
  } = useRetrieveReportPendingSync();

  // Component's State
  const [eventsUploadDetails, setEventsUploadDetails] = useState<EventUploadDetails[]>([]);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [connectionType, setConnectionType] = useState('');

  // Component's Life-cycle Events
  useEffect(() => {
    const initData = async () => {
      const reportsUploadDetails = await retrieveReportsAndAttachmentsUploadStatus();
      setEventsUploadDetails(reportsUploadDetails);
    };

    try {
      verifyInternetConnection();
      initData();
    } catch (error) {
      log.error(`[ReportsPendingSync] :: Could not get reports upload details - ${error}`);
    }
  }, []);

  // Utilitity Functions
  const formatEventUploadDetails = (event: EventUploadDetails) => {
    const pending = [];
    const uploaded = [];

    if (event.isReportUploaded) {
      uploaded.push(t('common.report'));
    } else {
      pending.push(t('common.report'));
    }

    // Pending Images
    if (event.pending.images > 0) {
      const text = `${event.pending.images} ${event.pending.images === 1 ? t('common.image') : t('common.images')}`;
      pending.push(text);
    }

    // Uploaded Images
    if (event.uploaded.images > 0) {
      const text = `${event.uploaded.images} ${event.uploaded.images === 1 ? t('common.image') : t('common.images')}`;
      uploaded.push(text);
    }

    // Pending Notes
    if (event.pending.notes > 0) {
      const text = `${event.pending.notes} ${event.pending.notes === 1 ? t('common.note') : t('common.notes')}`;
      pending.push(text);
    }

    // Uploaded Notes
    if (event.uploaded.notes > 0) {
      const text = `${event.uploaded.notes} ${event.uploaded.notes === 1 ? t('common.note') : t('common.notes')}`;
      uploaded.push(text);
    }

    return {
      pending,
      uploaded,
    };
  };

  const navigateToReportForm = useCallback(async (reportId: number) => {
    const reportEvent = await retrieveReportPendingSync(reportId.toString());

    if (reportEvent) {
      navigation.navigate('ReportForm', {
        reportId,
        title: reportEvent.title,
        typeId: reportEvent.type_id.toString(),
        coordinates: [0, 0] as Position,
        schema: reportEvent.schema,
        geometryType: reportEvent.geometry_type,
        isEditMode: true,
      });
    }
  }, []);

  const verifyInternetConnection = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable !== null) {
        setIsDeviceOnline(state.isInternetReachable);
        setConnectionType(state.type);
      }
    });
    return () => {
      unsubscribe();
    };
  };

  const getUploadSyncError = (typeError: number) => {
    switch (typeError) {
      case 1: {
        return t('reports.NoInternetConnection');
      }
      case 2: {
        return t('reports.ServerUploadError');
      }
      case 3: {
        return t('reports.NotAuthorized');
      }
      case 4: {
        return t('reports.wifiDataConnectionRequired');
      }
      case 5: {
        return t('reports.BadRequest');
      }
      default: {
        break;
      }
    }
    return '';
  };

  const getUploadErrorReason = (state: string, hasNotes: boolean) => {
    const isUploadPhotosWifiActive = getBoolForKey(UPLOAD_PHOTOS_WIFI);
    if (isDeviceOnline) {
      if (state === '400') {
        return getUploadSyncError(PendingEventStatus.BadRequest);
      }
      if (state === '403') {
        return getUploadSyncError(PendingEventStatus.NotAuthorized);
      }
      if (!hasNotes && isUploadPhotosWifiActive && connectionType === NetInfoStateType.cellular) {
        return getUploadSyncError(PendingEventStatus.WifiRequired);
      }
      return getUploadSyncError(PendingEventStatus.ServerUploadError);
    }
    return getUploadSyncError(PendingEventStatus.NoInternetConnection);
  };

  // Flat List Item
  // @ts-ignore
  const renderItem = ({ item }) => {
    const { pending, uploaded } = formatEventUploadDetails(item);

    return (
      <Pressable onPress={() => navigateToReportForm(item.reportId)}>
        <View style={styles.listItem} backgroundColor={Colors.white}>
          <View style={styles.detailsContainer}>
            <Text heading3>{item.reportTitle}</Text>
            <Text color={Colors.secondaryMobileGray}>
              {`${t('common.uploaded')}: ${uploaded.length > 0 ? uploaded.join(', ') : t('common.none')}`}
            </Text>
            <Text color={Colors.secondaryMobileGray}>
              {`${t('common.pending')}: ${pending.join(', ')}`}
            </Text>
            <Text color={Colors.secondaryMobileGray}>
              {`${t('common.reason')}: ${
                getUploadErrorReason(item.state, item.pending.notes > 0)
              }`}
            </Text>
          </View>
          {!item.isReportUploaded && (
            <View style={styles.rightArrowContainer}>
              <ReportsArrowIcon />
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <FlatList
          data={eventsUploadDetails}
          renderItem={renderItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export { ReportsPendingSyncView };
