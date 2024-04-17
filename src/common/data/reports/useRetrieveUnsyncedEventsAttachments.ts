// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { SELECT_EVENTS_ATTACHMENTS_PENDING_SYNC } from '../sql/queries';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { ReportFormEventAttachments } from '../../types/types';

enablePromise(true);

export const useRetrieveUnsyncedEventsAttachments = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveUnsyncedEventsAttachments = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User Account ID
    if (dbInstance) {
      // Get information from the local database
      const unsyncedEventsWithAttachments = await retrieveData(
        dbInstance,
        SELECT_EVENTS_ATTACHMENTS_PENDING_SYNC,
      );

      const unsyncedEventsAttachmentsList: ReportFormEventAttachments[] = [];

      if (unsyncedEventsWithAttachments && unsyncedEventsWithAttachments.length > 0) {
        for (let i = 0; i < unsyncedEventsWithAttachments[0].rows.length; i++) {
          unsyncedEventsAttachmentsList.push(unsyncedEventsWithAttachments[0].rows.item(i));
        }
      }

      return unsyncedEventsAttachmentsList;
    }

    return [];
  }, []);

  return { retrieveUnsyncedEventsAttachments };
};
