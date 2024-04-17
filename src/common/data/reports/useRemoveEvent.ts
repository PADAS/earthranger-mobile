// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { REMOVE_DRAFT_ATTACHMENTS, DELETE_REPORT_BY_ID } from '../sql/queries';

enablePromise(true);

export const useRemoveEvent = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const removeEvent = useCallback(async (id: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      const result = await retrieveData(
        dbInstance,
        DELETE_REPORT_BY_ID,
        [id],
      );

      if (result) {
        await retrieveData(dbInstance, REMOVE_DRAFT_ATTACHMENTS, [id]);
        return result[0].rowsAffected;
      }
    }
    return -1;
  }, []);

  return {
    removeEvent,
  };
};
