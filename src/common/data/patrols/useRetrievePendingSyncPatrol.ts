// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import {
  SELECT_PATROL_BY_ID,
  SELECT_PENDING_SYNC_PATROLS,
  SELECT_PENDING_SYNC_PATROLS_COUNT_PROFILE,
  SELECT_PENDING_SYNC_PATROLS_COUNT_USER,
} from '../sql/queries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedPatrol } from '../../types/types';
import { UserType } from '../../enums/enums';
import { useRetrieveUser } from '../users/useRetrieveUser';

export const useRetrievePendingSyncPatrol = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo } = useRetrieveUser();

  const retrievePendingSyncPatrolsCount = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User's type info
    const userInfo = await retrieveUserInfo();

    const profileId = (userInfo && userInfo.userId !== null) ? `${userInfo.userId}` : '';

    const params = userInfo?.userType === UserType.profile ? [profileId] : [];

    if (dbInstance && userInfo) {
      // Get information from the local database
      const pendingCount = await retrieveData(
        dbInstance,
        userInfo.userType === UserType.profile
          ? SELECT_PENDING_SYNC_PATROLS_COUNT_PROFILE
          : SELECT_PENDING_SYNC_PATROLS_COUNT_USER,
        params,
      );

      if (pendingCount && pendingCount[0].rows.length === 1) {
        return pendingCount[0].rows.item(0).count;
      }
    }

    return -1;
  }, []);

  const retrievePendingSyncPatrols = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const patrols = await retrieveData(dbInstance, SELECT_PENDING_SYNC_PATROLS);
      const patrolsList: PersistedPatrol[] = [];

      if (patrols && patrols.length > 0) {
        for (let i = 0, l = patrols[0].rows.length; i < l; i++) {
          if (patrols[0].rows.item(i).account_id) {
            patrolsList.push({
              id: patrols[0].rows.item(i).id,
              remote_id: patrols[0].rows.item(i).remote_id,
              account_id: patrols[0].rows.item(i).account_id,
              profile_id: patrols[0].rows.item(i).profile_id,
              title: patrols[0].rows.item(i).title,
              priority: patrols[0].rows.item(i).priority,
              state: patrols[0].rows.item(i).state,
              created_at: patrols[0].rows.item(i).created_at.toString(),
              updated_at: patrols[0].rows.item(i)?.updated_at?.toString(),
            });
          }
        }
      }
      return patrolsList;
    }

    return [];
  }, []);

  // eslint-disable-next-line max-len
  const retrievePendingSyncPatrol = useCallback(async (patrolId: string): Promise<PersistedPatrol | null> => {
    // Get database connection instance
    const dbInstance = await getDBInstance();
    let patrol: PersistedPatrol | null = null;

    if (dbInstance) {
      // Get information from the local database
      // eslint-disable-next-line max-len
      const patrolResult = await retrieveData(dbInstance, SELECT_PATROL_BY_ID, [patrolId]);

      if (patrolResult) {
        patrol = patrolResult[0].rows.item(0);
        return patrol;
      }
    }

    return patrol;
  }, []);

  return {
    retrievePendingSyncPatrolsCount,
    retrievePendingSyncPatrols,
    retrievePendingSyncPatrol,
  };
};
