// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { UPDATE_PATROL_SEGMENTS_REMOTE_ID } from '../sql/queries';
import { useInsertData } from '../hooks/useInsertData';

enablePromise(true);

export const useUpdatePatrolSegmentRemoteId = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();

  const updatePatrolSegmentRemoteId = useCallback(async (patrolId: string, remoteId: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Update information in the local database
      await insertData(
        dbInstance,
        UPDATE_PATROL_SEGMENTS_REMOTE_ID,
        [remoteId, patrolId],
      );
    }

    return [];
  }, []);

  return { updatePatrolSegmentRemoteId };
};
