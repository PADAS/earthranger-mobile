// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { getSecuredStringForKey } from '../storage/utils';
import { SELECT_PATROL_TYPES_BY_USER } from '../sql/queries';
import { useGetDBConnection } from '../PersistentStore';
import { USER_ID_KEY } from '../../constants/constants';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedPatrolType } from '../../types/types';
import { cleanUpSvg } from '../../utils/svgIconsUtils';

enablePromise(true);

export const useRetrievePatrolTypes = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrievePatrolTypes = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const patrolTypes = await retrieveData(dbInstance, SELECT_PATROL_TYPES_BY_USER, [getSecuredStringForKey(USER_ID_KEY) || '']);
      const patrolTypesList: PersistedPatrolType[] = [];

      if (patrolTypes && patrolTypes.length > 0) {
        for (let i = 0, l = patrolTypes[0].rows.length; i < l; i++) {
          patrolTypesList.push({
            id: patrolTypes[0].rows.item(i).id,
            remote_id: patrolTypes[0].rows.item(i).remote_id,
            account_id: patrolTypes[0].rows.item(i).account_id,
            value: patrolTypes[0].rows.item(i).value,
            display: patrolTypes[0].rows.item(i).display,
            icon: patrolTypes[0].rows.item(i).icon,
            icon_svg: cleanUpSvg(patrolTypes[0].rows.item(i).icon_svg),
            default_priority: patrolTypes[0].rows.item(i).default_priority,
            is_active: patrolTypes[0].rows.item(i).is_active,
            is_selected: false,
          });
        }
      }
      return patrolTypesList;
    }

    return [];
  }, []);

  return { retrievePatrolTypes };
};
