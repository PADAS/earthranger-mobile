// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { SELECT_PATROL_DETAILS_BY_PATROL_ID } from '../sql/queries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedPatrolDetail } from '../../types/types';

enablePromise(true);

export const useRetrievePatrolDetailsByPatrolId = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrievePatrolDetailsByPatrolId = useCallback(async (patrolId: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const patrolDetails = await retrieveData(
        dbInstance,
        SELECT_PATROL_DETAILS_BY_PATROL_ID,
        [patrolId],
      );

      return patrolDetails && patrolDetails.length > 0
        ? patrolDetails[0].rows.item(0) as PersistedPatrolDetail : null;
    }

    return null;
  }, []);

  return { retrievePatrolDetailsByPatrolId };
};
