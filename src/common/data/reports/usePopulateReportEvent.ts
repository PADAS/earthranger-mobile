// External Dependencies
import { useCallback } from 'react';
import dayjs from 'dayjs';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { INSERT_EVENT_PROFILE, INSERT_EVENT_USER } from '../sql/queries';
import { logSQL } from '../../utils/logUtils';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import { EventData } from '../../types/types';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { UserType } from '../../enums/enums';

export const usePopulateReportEvent = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveUserInfo } = useRetrieveUser();

  const populateReportEvent = useCallback(async (eventData: EventData) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get User's type of account and ID
      const userInfo = await retrieveUserInfo();

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) ?? '';

      const timestamp = dayjs().format();

      const profileParams = [accountId,
        userInfo?.userId || '',
        eventData.eventTypeId.toString(),
        eventData.title,
        eventData.latitude.toString(),
        eventData.longitude.toString(),
        eventData.geometry,
        eventData.event_values,
        eventData.isDraft.toString(),
        eventData.createdAt || timestamp,
        Date.now().toString(),
        eventData.patrol_segment_id?.toString() ?? ''];

      const userParams = [accountId,
        eventData.eventTypeId.toString(),
        eventData.title,
        eventData.latitude.toString(),
        eventData.longitude.toString(),
        eventData.geometry,
        eventData.event_values,
        eventData.isDraft.toString(),
        eventData.createdAt || timestamp,
        Date.now().toString(),
        eventData.patrol_segment_id?.toString() ?? ''];

      if (dbInstance && userInfo) {
        try {
          // eslint-disable-next-line no-await-in-loop
          return await insertData(
            dbInstance,
            userInfo?.userType === UserType.profile ? INSERT_EVENT_PROFILE : INSERT_EVENT_USER,
            userInfo?.userType === UserType.profile ? profileParams : userParams,
          );
        } catch {
          logSQL.error('Report types could not be inserted into the local database');
        }
      }
      logSQL.debug('events table updated');
    } catch (error) {
      logSQL.error('[usePopulateReportEvent] - insertData: error', error);
    }

    return -1;
  }, []);

  return { populateReportEvent };
};
