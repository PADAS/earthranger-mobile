// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import {
  SELECT_ATTACHMENTS_BY_ID,
  SELECT_DRAFT_EVENTS_PROFILE,
  SELECT_DRAFT_EVENTS_USER,
  SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_COUNT_PROFILE,
  SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_COUNT_USER,
  SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_PROFILE,
  SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_USER,
  SELECT_EVENTS_PENDING_SYNC,
  SELECT_EVENT_PENDING_SYNC,
} from '../sql/queries';
import { USER_ID_KEY } from '../../constants/constants';
import { getSecuredStringForKey } from '../storage/utils';
import { EventUploadDetails, DraftReports, ReportFormFullEvent } from '../../types/types';
import { isEmptyString } from '../../utils/stringUtils';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { UserType } from '../../enums/enums';

enablePromise(true);

export const useRetrieveReportPendingSync = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo } = useRetrieveUser();

  const retrieveReportPendingSyncCount = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User's type info
    const userInfo = await retrieveUserInfo();

    const profileId = (userInfo && userInfo.userId !== null) ? `${userInfo.userId}` : '';

    const params = userInfo?.userType === UserType.profile ? [profileId] : [];

    if (dbInstance) {
      const pendingCount = await retrieveData(
        dbInstance,
        userInfo?.userType === UserType.profile
          ? SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_COUNT_PROFILE
          : SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_COUNT_USER,
        params,
      );

      if (pendingCount && pendingCount[0].rows.length === 1) {
        return pendingCount[0].rows.item(0).count;
      }

      return 0;
    }
    return -1;
  }, []);

  const retrieveReportPendingSync = useCallback(async (reportId: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const draftEvent = await retrieveData(
        dbInstance,
        SELECT_EVENT_PENDING_SYNC,
        [reportId],
      );

      let draftEventItem: DraftReports | null = null;

      if (draftEvent && draftEvent.length > 0) {
        draftEventItem = draftEvent[0].rows.item(0);
      }

      return draftEventItem;
    }

    return null;
  }, []);

  const retrieveReportsPendingSync = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    if (dbInstance) {
      // Get information from the local database
      const unsyncedEvents = await retrieveData(
        dbInstance,
        SELECT_EVENTS_PENDING_SYNC,
        [accountId],
      );

      const unsyncedEventsList: ReportFormFullEvent[] = [];

      if (unsyncedEvents && unsyncedEvents.length > 0) {
        for (let i = 0; i < unsyncedEvents[0].rows.length; i++) {
          unsyncedEventsList.push(unsyncedEvents[0].rows.item(i));
        }
      }

      return unsyncedEventsList;
    }

    return [];
  }, []);

  const retrieveDraftReports = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User's type info
    const userInfo = await retrieveUserInfo();

    const profileId = (userInfo && userInfo.userId !== null) ? `${userInfo.userId}` : '';

    const params = userInfo?.userType === UserType.profile ? [profileId] : [];

    if (dbInstance) {
      // Get information from the local database
      const draftEvents = await retrieveData(
        dbInstance,
        userInfo?.userType === UserType.profile
          ? SELECT_DRAFT_EVENTS_PROFILE : SELECT_DRAFT_EVENTS_USER,
        params,
      );

      const draftEventsList: DraftReports[] = [];

      if (draftEvents && draftEvents.length > 0) {
        for (let i = 0; i < draftEvents[0].rows.length; i++) {
          draftEventsList.push(draftEvents[0].rows.item(i));
        }
      }

      return draftEventsList;
    }

    return [];
  }, []);

  const retrieveReportsAndAttachmentsUploadStatus = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    // Get User's type info
    const userInfo = await retrieveUserInfo();

    const profileId = (userInfo && userInfo.userId !== null) ? `${userInfo.userId}` : '';

    const params = userInfo?.userType === UserType.profile ? [profileId] : [];

    if (dbInstance) {
      // Get information from the local database
      const pendingSyncEvents = await retrieveData(
        dbInstance,
        userInfo?.userType === UserType.profile
          ? SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_PROFILE
          : SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_USER,
        params,
      );

      const detailedEventsPendingSyncList: EventUploadDetails[] = [];

      if (pendingSyncEvents && pendingSyncEvents.length > 0) {
        for (let i = 0; i < pendingSyncEvents[0].rows.length; i++) {
          // Get event's attachments details from the local database
          // eslint-disable-next-line no-await-in-loop
          const attachments = await retrieveData(
            dbInstance,
            SELECT_ATTACHMENTS_BY_ID,
            [pendingSyncEvents[0].rows.item(i).event_id.toString(), accountId],
          );

          if (attachments && attachments.length > 0) {
            let uploadedNotes = 0;
            let pendingNotes = 0;
            let uploadedImages = 0;
            let pendingImages = 0;

            for (let j = 0; j < attachments[0].rows.length; j++) {
              if (attachments[0].rows.item(j).type === 'note' && attachments[0].rows.item(j).uploaded === 0) {
                pendingNotes += 1;
              } else if (attachments[0].rows.item(j).type === 'note' && attachments[0].rows.item(j).uploaded === 1) {
                uploadedNotes += 1;
              } else if (attachments[0].rows.item(j).type === 'photo' && attachments[0].rows.item(j).uploaded === 0) {
                pendingImages += 1;
              } else if (attachments[0].rows.item(j).type === 'photo' && attachments[0].rows.item(j).uploaded === 1) {
                uploadedImages += 1;
              }
            }
            detailedEventsPendingSyncList.push({
              reportId: pendingSyncEvents[0].rows.item(i).event_id,
              reportTitle: pendingSyncEvents[0].rows.item(i).event_title,
              state: pendingSyncEvents[0].rows.item(i).event_state,
              isReportUploaded: !isEmptyString(pendingSyncEvents[0].rows.item(i).event_remote_id),
              uploaded: {
                notes: uploadedNotes,
                images: uploadedImages,
              },
              pending: {
                notes: pendingNotes,
                images: pendingImages,
              },
            });
          }
        }
      }

      return detailedEventsPendingSyncList;
    }

    return [];
  }, []);

  return {
    retrieveReportPendingSyncCount,
    retrieveReportsPendingSync,
    retrieveReportPendingSync,
    retrieveDraftReports,
    retrieveReportsAndAttachmentsUploadStatus,
  };
};
