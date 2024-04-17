// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { USER_ID_KEY } from '../../constants/constants';
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { INSERT_USER_SUBJECTS } from '../sql/queries';
import { getPatrolTrackedBy } from '../../../api/patrolsAPI';
import { getSecuredStringForKey } from '../storage/utils';
import { logSQL } from '../../utils/logUtils';
import { useRetrieveUser } from './useRetrieveUser';
import { isEmptyString } from '../../utils/stringUtils';

export const usePopulateUserSubjects = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveUserById } = useRetrieveUser();

  const populateUserSubjects = useCallback(async (accessToken: string) => {
    try {
      // Fetch information from API
      const remoteUserSubjects = await getPatrolTrackedBy(accessToken);

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const persistedUser = await retrieveUserById(accountId);
        let userSubjects = remoteUserSubjects.data.properties.leader.enum
          .map((subject) => (
            [subject.id, accountId, subject.name, subject.content_type]
          ));
        userSubjects = filterUserSubjects(userSubjects, persistedUser);

        for (let i = 0, l = userSubjects.length; i < l; i++) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await insertData(
              dbInstance,
              INSERT_USER_SUBJECTS,
              userSubjects[i],
            );
          } catch {
            logSQL.error('User subjects could not be inserted into the local database');
          }
        }
      }
      logSQL.debug('user_subjects table updated');
    } catch (error) {
      logSQL.error('[usePopulateUserSubjects] - getPatrolTrackedBy: error', error);
    }
  }, []);

  return { populateUserSubjects };
};

export const filterUserSubjects = (subjects: string[][], user: any) => {
  if (isEmptyString(user.first_name) && isEmptyString(user.last_name)) {
    return subjects.filter((subject) => subject[2] !== user.username);
  }
  const fullName = `${user.first_name} ${user.last_name}`;
  return subjects.filter((subject) => subject[2] !== user.username && subject[2] !== fullName);
};
