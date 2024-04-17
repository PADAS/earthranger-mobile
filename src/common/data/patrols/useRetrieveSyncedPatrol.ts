// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { SELECT_SYNCED_PATROLS } from '../sql/queries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedPatrol } from '../../types/types';

export const useRetrieveSyncedPatrol = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveSyncedPatrol = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const patrols = await retrieveData(dbInstance, SELECT_SYNCED_PATROLS);
      const patrolsList: PersistedPatrol[] = [];

      if (patrols && patrols.length > 0) {
        for (let i = 0, l = patrols[0].rows.length; i < l; i++) {
          patrolsList.push({
            id: patrols[0].rows.item(i).id,
            remote_id: patrols[0].rows.item(i).remote_id,
            account_id: patrols[0].rows.item(i).account_id,
            profile_id: patrols[0].rows.item(i).profile_id,
            title: patrols[0].rows.item(i).title,
            priority: patrols[0].rows.item(i).priority,
            state: patrols[0].rows.item(i).state,
            created_at: patrols[0].rows.item(i).created_at.toString(),
            updated_at: patrols[0].rows.item(i).updated_at.toString(),
          });
        }
      }
      return patrolsList;
    }

    return [];
  }, []);

  return { retrieveSyncedPatrol };
};
