// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { UPDATE_ATTACHMENT_REMOTE_ID } from '../sql/queries';
import { useInsertData } from '../hooks/useInsertData';

enablePromise(true);

export const useUpdateReportAttachmentRemoteId = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();

  const updateReportAttachmentRemoteId = useCallback(async (sqlParams: string[]) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Update information in the local database
      await insertData(
        dbInstance,
        UPDATE_ATTACHMENT_REMOTE_ID,
        sqlParams,
      );
    }

    return [];
  }, []);

  return { updateReportAttachmentRemoteId };
};
