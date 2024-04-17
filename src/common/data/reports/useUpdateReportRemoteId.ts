// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { UPDATE_EVENT_REMOTE_ID } from '../sql/queries';
import { useExecuteSql } from '../hooks/useInsertData';

enablePromise(true);

export const useUpdateEventRemoteId = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { executeSql } = useExecuteSql();

  const updateEventRemoteId = useCallback(async (sqlParams: any[]) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Update information in the local database
      await executeSql(
        dbInstance,
        UPDATE_EVENT_REMOTE_ID,
        sqlParams,
      );
    }

    return [];
  }, []);

  return { updateEventRemoteId };
};
