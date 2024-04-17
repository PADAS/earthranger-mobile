// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { USER_ID_KEY } from '../../constants/constants';
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { INSERT_PATROL_TYPE, UPSERT_PATROL_TYPE } from '../sql/queries';
import { getPatrolTypes, parsePatrolTypes } from '../../../api/patrolsAPI';
import { getSecuredStringForKey } from '../storage/utils';
import { logSQL, logSync } from '../../utils/logUtils';
import { PatrolType } from '../../types/patrolsResponse';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { UserType } from '../../enums/enums';

export const usePopulatePatrolTypes = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveUserInfo } = useRetrieveUser();

  const populatePatrolTypes = useCallback(async (accessToken: string) => {
    try {
      // Get User's type info
      const userInfo = await retrieveUserInfo();
      let profileId;

      if (userInfo) {
        profileId = userInfo.userType === UserType.profile
          ? getSecuredStringForKey(USER_ID_KEY)
          : undefined;
      }

      // Fetch information from remote database
      let patrolTypes;
      try {
        patrolTypes = await getPatrolTypes(accessToken, profileId);
      } catch (error) {
        logSync.error('[usePopulatePatrolTypes] getPatrolTypes error', error);
      }

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (patrolTypes) {
        if (dbInstance) {
          const parsedPatrolTypes = await parsePatrolTypes(
            patrolTypes.data,
            accountId.toString(),
          );

          for (let i = 0, l = parsedPatrolTypes.length; i < l; i++) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await insertData(
                dbInstance,
                INSERT_PATROL_TYPE,
                parsedPatrolTypes[i],
              );
            } catch (error) {
              logSQL.error('Patrol Types could not be inserted into the local database: error', error);
            }
          }
        }
      }
      logSQL.debug('patrol_types table updated');
    } catch (error) {
      logSQL.error('[usePopulatePatrolTypes] - getPatrolTypes: error', error);
    }
  }, []);

  const upsertPatrolTypes = useCallback(async (patrolTypes: PatrolType[]) => {
    // Get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      const parsedPatrolTypes = await parsePatrolTypes(
        patrolTypes,
        accountId.toString(),
      );

      for (let i = 0, l = parsedPatrolTypes.length; i < l; i++) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await insertData(
            dbInstance,
            UPSERT_PATROL_TYPE,
            parsedPatrolTypes[i],
          );
        } catch (error: any) {
          logSQL.error('[upsertPatrolTypes] - Patrol Types could not be inserted into the local database');
          logSQL.error(error);
        }
      }
    }
    logSQL.info('[End Patrol types updates] - Patrol Types');
  }, []);

  return { populatePatrolTypes, upsertPatrolTypes };
};
