// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { encode } from '../../utils/base64Utils';
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import {
  INSERT_USER,
  INSERT_USER_PROFILE,
  SELECT_USER_BY_ID,
  SELECT_USER_BY_REMOTE_ID,
  SELECT_USER_PROFILE_PINS,
  UPSERT_USER,
  UPSERT_USER_PROFILE,
} from '../sql/userQueries';
import { logSQL, logSync } from '../../utils/logUtils';
import {
  createSubjectForUsername, getRemoteUser, getRemoteUserByID, getUserProfiles,
} from '../../../api/usersAPI';
import { getSecuredStringForKey, setSecuredStringForKey } from '../storage/utils';
import {
  SUBJECT_ID_KEY, USER_ID_KEY, USER_NAME_KEY, USER_REMOTE_ID_KEY,
} from '../../constants/constants';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { User } from '../../types/usersResponse';
import { getApiStatus } from '../../utils/errorUtils';
import { ApiResponseCodes } from '../../types/apiModels';
import { isEmptyString } from '../../utils/stringUtils';
import { getAuthState, setAuthState } from '../../utils/authUtils';
import { AuthState } from '../../enums/enums';

export const usePopulateUsers = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveData } = useRetrieveData();

  const populateUsers = useCallback(async (accessToken: string) => {
    try {
      const username = getSecuredStringForKey(USER_NAME_KEY);
      const contentType = 'observations.subject';
      let subjectId = '';

      // Fetch information from remote database
      const user = await getRemoteUser(accessToken);

      if (username && user && !user.data.subject) {
        const newSubject = await createSubjectForUsername(accessToken, user.data.id);
        if (newSubject.status === 201) {
          const userAsSubject = await getRemoteUserByID(accessToken, user.data.id);
          subjectId = userAsSubject.data.subject.id;
        } else {
          logSync.error('Subject could not be created, status: ', newSubject.status);
          return apiresponsecodes.Unknown;
        }
      } else if (username && user && user.data.subject) {
        subjectId = user.data.subject.id;
      }

      setSecuredStringForKey(SUBJECT_ID_KEY, subjectId);

      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await insertData(dbInstance, INSERT_USER, [
            user.data.id,
            user.data.username,
            user.data.first_name,
            user.data.last_name,
            user.data.email,
            contentType,
            subjectId,
            user.data.accepted_eula ? '1' : '0',
            encode(user.data.pin || ''),
            JSON.stringify(user.data.permissions || {}),
            user.data.is_superuser ? '1' : '0',
          ]);

          const newUser = await retrieveData(dbInstance, SELECT_USER_BY_REMOTE_ID, [user.data.id]);

          if (newUser && newUser?.length > 0) {
            setSecuredStringForKey(USER_ID_KEY, newUser[0].rows.item(0).id.toString());
            setSecuredStringForKey(USER_REMOTE_ID_KEY, user.data.id);
          }
          logSQL.debug('accounts_user table updated');
        } catch {
          logSQL.error('User could not be inserted into the local database');
        }
      }
    } catch (error) {
      logSync.error('Fetch information from remote database: error', error);
      return getApiStatus(error);
    }
    return ApiResponseCodes.Succeeded;
  }, []);

  const upsertUsers = useCallback(async (accessToken: string, user: User) => {
    try {
      const contentType = 'observations.subject';
      let subjectId = '';

      if (user && !user.subject) {
        const subject = await createSubjectForUsername(accessToken, user.id);
        const updatedUser = await getRemoteUserByID(accessToken, user.id);
        if (subject.status === 201) {
          subjectId = updatedUser.data.subject.id;
        } else {
          logSync.warn('Subject could not be created');
        }
      } else if (user?.subject) {
        subjectId = user.subject.id;
      }

      setSecuredStringForKey(SUBJECT_ID_KEY, subjectId);

      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance && user) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await insertData(dbInstance, UPSERT_USER, [
            user.id,
            user.username,
            user.first_name,
            user.last_name,
            user.email,
            contentType,
            subjectId,
            user.accepted_eula ? '1' : '0',
            encode(user.pin || ''),
            JSON.stringify(user.permissions || {}),
            user.is_superuser ? '1' : '0',
          ]);

          const newUser = await retrieveData(dbInstance, SELECT_USER_BY_REMOTE_ID, [user.id]);

          if (newUser && newUser?.length > 0) {
            setSecuredStringForKey(USER_ID_KEY, newUser[0].rows.item(0).id.toString());
            setSecuredStringForKey(USER_REMOTE_ID_KEY, user.id);
          }
          logSQL.debug('accounts_user table updated');
        } catch (error) {
          logSQL.error('User could not be inserted into the local database', error);
        }
      }
    } catch (error) {
      logSQL.error('[usePopulateUsers] - getUsers: error', error);
      return getApiStatus(error);
    }
    return ApiResponseCodes.Succeeded;
  }, []);

  const populateUserProfiles = useCallback(async (accessToken: string) => {
    try {
      const userId = getSecuredStringForKey(USER_REMOTE_ID_KEY);
      const contentType = 'observations.subject';
      let subjectId = '';

      // Fetch information from remote database
      const userProfiles = await getUserProfiles(accessToken, userId || '');

      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get current user data
      if (dbInstance && userProfiles.data.length > 0) {
        for (let i = 0, l = userProfiles.data.length; i < l; i++) {
          try {
            if (userProfiles.data[i].pin) {
              if (!userProfiles.data[i].subject) {
                // eslint-disable-next-line no-await-in-loop
                const profileSubject = await createSubjectForUsername(
                  accessToken,
                  userProfiles.data[i].id,
                );
                // eslint-disable-next-line no-await-in-loop
                const profileUser = await getRemoteUserByID(
                  accessToken,
                  userProfiles.data[i].id,
                  userProfiles.data[i].id,
                );

                if (profileSubject.status === 201) {
                  subjectId = profileUser.data.subject.id;
                } else {
                  logSync.warn('Subject could not be created');
                  subjectId = '';
                }
              } else {
                subjectId = userProfiles.data[i].subject.id;
              }

              // eslint-disable-next-line no-await-in-loop
              const profilePermissions = await getRemoteUser(
                accessToken,
                userProfiles.data[i].id,
              );

              // eslint-disable-next-line no-await-in-loop
              await insertData(dbInstance, INSERT_USER_PROFILE, [
                userProfiles.data[i].id,
                getSecuredStringForKey(USER_ID_KEY) || '',
                userProfiles.data[i].username,
                encode(userProfiles.data[i].pin || ''),
                contentType,
                subjectId,
                JSON.stringify(profilePermissions.data.permissions || {}),
              ]);

              // clear out profile ids to ensure no duplications
              subjectId = '';
            }
          } catch (error: any) {
            logSQL.error('User profile could not be inserted into the local database', error);
          }
        }

        logSQL.debug('user_profiles table updated');
      }
    } catch (error) {
      logSync.error('Fetch information from remote database: error', error);
    }
  }, []);

  const upsertUserProfiles = useCallback(async (
    accessToken: string,
    remoteUserProfiles: User[],
  ) => {
    let subjectId = '';

    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        for (let i = 0, l = remoteUserProfiles.length; i < l; i++) {
          const remoteProfile = remoteUserProfiles[i];

          if (!remoteProfile.subject) {
            // eslint-disable-next-line no-await-in-loop
            const profileSubject = await createSubjectForUsername(
              accessToken,
              remoteProfile.id,
            );

            // eslint-disable-next-line no-await-in-loop
            const profileUser = await getRemoteUserByID(
              accessToken,
              remoteProfile.id,
              remoteProfile.id,
            );
            if (profileSubject.status === 201) {
              subjectId = profileUser.data.subject.id;
            } else {
              logSync.warn('Subject could not be created');
              subjectId = '';
            }
          } else {
            subjectId = remoteProfile.subject.id;
          }

          // eslint-disable-next-line no-await-in-loop
          const profilePermissions = await getRemoteUser(
            accessToken,
            remoteProfile.id,
          );

          // eslint-disable-next-line no-await-in-loop
          await insertData(dbInstance, UPSERT_USER_PROFILE, [
            remoteProfile.id,
            accountId,
            remoteProfile.username,
            remoteProfile.pin ? encode(remoteProfile.pin) : '',
            '',
            subjectId,
            JSON.stringify(profilePermissions.data.permissions || {}),
          ]);
        }
      }
    } catch (error: any) {
      logSQL.error(`[Upsert User Profiles] - Could not complete - ${error}`);
    }

    logSQL.info('[End Update] - User Profiles');
  }, []);

  const isLoggedInUserAccount = useCallback(async (userRemoteId: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const user = await retrieveData(dbInstance, SELECT_USER_BY_REMOTE_ID, [userRemoteId]);

        if (user && user?.length > 0 && user[0].rows.length > 0) {
          return true;
        }
      }
    } catch (error: any) {
      logSQL.error(`[Is logged in user account] - Error - ${error}`);
    }
    return false;
  }, []);

  const isPinWorkflowAvailable = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        type UserProfilePin = {
          userPin: string,
          profilePin: string,
        };

        const pinsResultSet = await retrieveData(
          dbInstance,
          SELECT_USER_PROFILE_PINS,
          [accountId],
        );

        const userProfilesPins = pinsResultSet && pinsResultSet[0].rows.length > 0
          ? pinsResultSet[0].rows.raw() as UserProfilePin[] : null;
        if (userProfilesPins && !isEmptyString(userProfilesPins[0].userPin)) {
          // eslint-disable-next-line max-len
          return userProfilesPins.some((userProfilePin) => !isEmptyString(userProfilePin.profilePin));
        }
      }
    } catch (error: any) {
      logSQL.error(`[isPinWorkflowAvailable] - Error while getting data - ${error}`);
    }

    return false;
  }, []);

  const checkIfParentUserPinIsSet = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        const userResultSet = await retrieveData(
          dbInstance,
          SELECT_USER_BY_ID,
          [accountId],
        );
        const pin = userResultSet && userResultSet?.length > 0
          ? userResultSet[0].rows.item(0).pin : '';
        return !isEmptyString(pin);
      }
    } catch (error: any) {
      logSQL.error(`[checkIfParentUserPinIsSet] - Error while getting data - ${error}`);
    }

    return false;
  }, []);

  const updateAuthState = useCallback(async () => {
    const authState = getAuthState();
    if (authState === AuthState.unknown
      || authState === AuthState.notRequired
    ) {
      const pinRequired = await isPinWorkflowAvailable();
      setAuthState(pinRequired ? AuthState.required : AuthState.notRequired);
    } else if (authState === AuthState.authenticated) {
      const pinRequired = await isPinWorkflowAvailable();
      if (!pinRequired) {
        const isParentUser = await isLoggedInUserAccount(getSecuredStringForKey(USER_REMOTE_ID_KEY) || '');
        if (isParentUser) {
          setAuthState(AuthState.notRequired);
        } else {
          setAuthState(AuthState.authInvalidated);
        }
      }
    }
  }, []);

  return {
    populateUsers,
    upsertUsers,
    populateUserProfiles,
    upsertUserProfiles,
    updateAuthState,
    isPinWorkflowAvailable,
    checkIfParentUserPinIsSet,
    isLoggedInUserAccount,
  };
};
