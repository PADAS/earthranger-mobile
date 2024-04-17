// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { UPDATE_PATROL_STATE } from '../sql/queries';
import log from '../../utils/logUtils';

export const useUpdatePatrolState = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();

  // eslint-disable-next-line max-len
  const updatePatrolState = useCallback(async (patrolId: string, state: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
      // Update information in the local database
        await insertData(
          dbInstance,
          UPDATE_PATROL_STATE,
          [state, patrolId],
        );
        log.debug('[populatePatrolUnauthorized]: Database updated');
      } else {
        log.error('[populatePatrolUnauthorized]: Unable to get the database connection');
      }
    } catch (error) {
      log.error('[populatePatrolUnauthorized] - insertData: error', error);
    }
  }, []);

  return { updatePatrolState };
};
