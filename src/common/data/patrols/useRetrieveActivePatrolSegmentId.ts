// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { SELECT_ACTIVE_PATROL_SEGMENT_ID } from '../sql/queries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';

enablePromise(true);

export const useRetrieveActivePatrolSegmentId = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveActivePatrolSegmentId = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const segments = await retrieveData(dbInstance, SELECT_ACTIVE_PATROL_SEGMENT_ID, []);

      if (segments && segments.length > 0) {
        return segments[0].rows.item(0).id;
      }
    }

    return undefined;
  }, []);

  return { retrieveActivePatrolSegmentId };
};
