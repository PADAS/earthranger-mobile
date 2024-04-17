// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { UPDATE_PATROL_REMOTE_ID } from '../sql/queries';
import { useInsertData } from '../hooks/useInsertData';

enablePromise(true);

export const useUpdatePatrolData = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();

  // eslint-disable-next-line max-len
  const updatePatrolRemoteId = useCallback(async (
    patrolId: string,
    serialNumber: string,
    remoteId: string,
    state: string,
  ) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Update information in the local database
      await insertData(
        dbInstance,
        UPDATE_PATROL_REMOTE_ID,
        [remoteId, serialNumber, state, patrolId],
      );
    }

    return [];
  }, []);

  return { updatePatrolRemoteId };
};
