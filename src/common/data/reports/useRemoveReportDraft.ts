// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { REMOVE_DRAFT_EVENT, REMOVE_DRAFT_ATTACHMENTS } from '../sql/queries';

enablePromise(true);

export const useRemoveReportDraft = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const removeReportDraft = useCallback(async (id: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      const queryCountResult = await retrieveData(
        dbInstance,
        REMOVE_DRAFT_EVENT,
        [id],
      );

      if (queryCountResult) {
        await retrieveData(dbInstance, REMOVE_DRAFT_ATTACHMENTS, [id]);
        return queryCountResult[0].rowsAffected;
      }
    }
    return -1;
  }, []);

  return {
    removeReportDraft,
  };
};
