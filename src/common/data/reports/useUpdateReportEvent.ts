// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { UPDATE_EVENT, UPDATE_EVENT_STATE } from '../sql/queries';
import log from '../../utils/logUtils';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import { EventData } from '../../types/types';

export const useUpdateReportEvent = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();

  const updateReportEvent = useCallback(async (eventData: EventData, eventId: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        try {
          // eslint-disable-next-line no-await-in-loop
          return await insertData(dbInstance, UPDATE_EVENT, [
            accountId,
            eventData.eventTypeId.toString(),
            eventData.title,
            eventData.latitude.toString(),
            eventData.longitude.toString(),
            eventData.geometry,
            eventData.event_values,
            eventData.isDraft.toString(),
            Date.now().toString(),
            eventId,
          ]);
        } catch {
          log.error('Report types could not be updated in the local database');
        }
      }
      log.debug('events table updated');
    } catch (error) {
      log.error('[useUpdateReportEvent] - updateData: error', error);
    }

    return -1;
  }, []);

  const updateReportEventState = useCallback(async (eventId: string, uploadState: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        await insertData(dbInstance, UPDATE_EVENT_STATE, [
          uploadState,
          eventId,
        ]);
        log.debug('Report state updated in the events table');
      } else {
        log.error('Unable to get the database connection');
      }
    } catch (error) {
      log.error('[useUpdateReportEvent] - updateReportEventState: error', error);
    }
  }, []);

  return { updateReportEvent, updateReportEventState };
};
