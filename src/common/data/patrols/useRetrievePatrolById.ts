// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { SELECT_PATROL_BY_ID } from '../sql/queries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';

export const useRetrievePatrolById = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrievePatrolById = useCallback(async (patrolId: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const patrol = await retrieveData(dbInstance, SELECT_PATROL_BY_ID, [patrolId]);

      if (patrol && patrol.length > 0) {
        return patrol[0].rows.item(0);
      }

      return null;
    }

    return null;
  }, []);

  return { retrievePatrolById };
};
