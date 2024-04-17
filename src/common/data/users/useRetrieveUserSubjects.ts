// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { SELECT_USER_SUBJECTS } from '../sql/queries';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedUserSubject } from '../../types/types';
import { logSQL } from '../../utils/logUtils';
import { getSecuredStringForKey } from '../storage/utils';
import { ACTIVE_USER_NAME_KEY, USER_NAME_KEY } from '../../constants/constants';
import { useRetrieveUser } from './useRetrieveUser';
import { UserType } from '../../enums/enums';

export const useRetrieveUserSubjects = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo, retrieveActiveUserDetails } = useRetrieveUser();

  const retrieveUserSubjects = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbSubjects = await retrieveData(dbInstance, SELECT_USER_SUBJECTS, []);
        const userSubjects: PersistedUserSubject[] = [];

        if (dbSubjects && dbSubjects.length > 0) {
          for (let i = 0; i < dbSubjects[0].rows.length; i++) {
            const item = dbSubjects[0].rows.item(i);
            item.isSelected = getSecuredStringForKey(USER_NAME_KEY) === item.name;
            userSubjects.push(item);
          }
        }
        return userSubjects;
      }
    } catch (error) {
      logSQL.error('[useRetrieveUserSubjects] - retrieveUserSubjects: error', error);
    }
    return [];
  }, []);

  const retrieveActiveUserAsUserSubject = useCallback(async () => {
    try {
      const userInfo = await retrieveUserInfo();

      if (userInfo) {
        const activeUserDetails = await retrieveActiveUserDetails(
          getSecuredStringForKey(ACTIVE_USER_NAME_KEY) || '',
          userInfo.userType || UserType.account,
        );

        return activeUserDetails;
      }
    } catch (error) {
      logSQL.error('[useRetrieveUserSubjects] - retrieveActiveUserAsSubject: error', error);
    }

    return null;
  }, []);

  return {
    retrieveUserSubjects,
    retrieveActiveUserAsUserSubject,
  };
};
