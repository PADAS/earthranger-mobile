// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import { useInsertData } from './useInsertData';
import { INSERT_SYNC_STATE, UPDATE_SYNC_STATE_SCOPE } from '../sql/queries';
import { logSQL } from '../../utils/logUtils';

export const useSyncState = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();

  const insertSyncState = useCallback(async (resource: string, scope: string, state: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();
    // get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    // create sql params
    const syncStateQuery:string[] = [accountId, resource, scope, state];

    if (dbInstance) {
      try {
        await insertData(dbInstance, INSERT_SYNC_STATE, syncStateQuery);
      } catch {
        logSQL.error(`Could not update ${resource} sync state`);
      }
    }
    logSQL.debug(`sync_state ${resource} updated`);
  }, []);

  const updateSyncState = useCallback(async (resource: string, scope: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();
    // get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    // create sql params
    const syncStateQuery:string[] = [scope, scope, accountId, resource];

    if (dbInstance) {
      try {
        await insertData(dbInstance, UPDATE_SYNC_STATE_SCOPE, syncStateQuery);
      } catch (error) {
        logSQL.error('Could not update sync state', error);
      }
    }
    logSQL.debug('sync_state table updated');
  }, []);

  return { insertSyncState, updateSyncState };
};
