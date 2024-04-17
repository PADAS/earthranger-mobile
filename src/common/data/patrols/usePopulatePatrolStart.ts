// External Dependencies
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useExecuteSql } from '../hooks/useInsertData';
import { INSERT_PATROL_SEGMENTS_START, INSERT_PATROL_START } from '../sql/queries';
import { logSQL } from '../../utils/logUtils';
import { getStringForKey } from '../storage/keyValue';
import { PATROL_TYPE_DISPLAY, USER_ID_KEY } from '../../constants/constants';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { getSecuredStringForKey } from '../storage/utils';
import { UserType } from '../../enums/enums';

export const usePopulatePatrolStart = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { executeSql } = useExecuteSql();
  const { retrieveUserInfo } = useRetrieveUser();

  const populatePatrolStart = useCallback(async (
    patrolTypeId: string,
    startLatitude: string | null,
    startLongitude: string | null,
    timestamp: string,
  ) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      const patrolTitle = getStringForKey(PATROL_TYPE_DISPLAY) || '';
      const patrolSegmentRemoteId = uuidv4();

      if (dbInstance) {
        const userInfo = await retrieveUserInfo();
        const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

        const patrolId = await executeSql(
          dbInstance,
          INSERT_PATROL_START,
          [
            patrolTitle,
            timestamp || dayjs().format(),
            accountId,
            userInfo?.userType === UserType.profile ? userInfo.userId : undefined,
          ],
        );

        if (patrolId) {
          await executeSql(
            dbInstance,
            INSERT_PATROL_SEGMENTS_START,
            [
              patrolSegmentRemoteId,
              patrolId,
              patrolTypeId,
              startLatitude,
              startLongitude,
              timestamp,
            ],
          );

          return patrolId;
        }
      }
      logSQL.debug('[usePopulatePatrolStart]: Database updated');
    } catch (error) {
      logSQL.error('[usePopulatePatrolStart] - insertData: error', error);
    }

    return '';
  }, []);

  return { populatePatrolStart };
};
