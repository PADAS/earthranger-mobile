// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import {
  SELECT_PROFILE_BY_REMOTE_ID,
  SELECT_USER_BY_ID,
  SELECT_USER_BY_PIN,
  SELECT_USER_BY_REMOTE_ID,
  SELECT_USER_BY_USERNAME,
  SELECT_USER_PROFILE_BY_USERNAME,
} from '../sql/queries';
import { logSQL } from '../../utils/logUtils';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { getSecuredStringForKey, setSecuredStringForKey } from '../storage/utils';
import { PARENT_USER_REMOTE_ID_KEY, USER_ID_KEY, USER_REMOTE_ID_KEY } from '../../constants/constants';
import { UserType } from '../../enums/enums';
import { PersistedUserSubject } from '../../types/types';

export const useRetrieveUser = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveUserInfo = useCallback(async () => {
    try {
      // Response
      // eslint-disable-next-line max-len
      const response: { userType: UserType | null, userId: string | null, permissions: string | null } = {
        userType: null,
        userId: null,
        permissions: null,
      };

      // Get currently logged in user remote ID
      const userRemoteId = getSecuredStringForKey(USER_REMOTE_ID_KEY);
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance && userRemoteId) {
        const userAccount = await retrieveData(
          dbInstance,
          SELECT_USER_BY_REMOTE_ID,
          [userRemoteId],
        );

        if (userAccount && userAccount[0].rows.length > 0) {
          response.userType = UserType.account;
          response.userId = userAccount[0].rows.item(0).id;
          response.permissions = userAccount[0].rows.item(0).permissions;

          return response;
        }

        const userProfile = await retrieveData(
          dbInstance,
          SELECT_PROFILE_BY_REMOTE_ID,
          [userRemoteId],
        );

        if (userProfile && userProfile[0].rows.length > 0) {
          response.userType = UserType.profile;
          response.userId = userProfile[0].rows.item(0).id;
          response.permissions = userProfile[0].rows.item(0).permissions;

          return response;
        }
      }
    } catch (error) {
      logSQL.error('[useRetrieveUser] - retrieveUserInfo: error', error);
    }

    return null;
  }, []);

  const retrieveUserByPin = useCallback(async (encodedPin: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbProfiles = await retrieveData(
          dbInstance,
          SELECT_USER_BY_PIN,
          [encodedPin, encodedPin],
        );

        if (dbProfiles && dbProfiles.length > 0) {
          return dbProfiles[0].rows.item(0);
        }
        return null;
      }
    } catch (error) {
      logSQL.error('[useRetrieveUserByPin] - retrieveUserByPin: error', error);
    }
    return null;
  }, []);

  const retrieveUserById = useCallback(async (userId: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbProfiles = await retrieveData(
          dbInstance,
          SELECT_USER_BY_ID,
          [userId],
        );

        if (dbProfiles && dbProfiles.length > 0) {
          return dbProfiles[0].rows.item(0);
        }
        return null;
      }
    } catch (error) {
      logSQL.error('[useRetrieveUser] - retrieveUserById: error', error);
    }
    return null;
  }, []);

  const retrieveParentUserRemoteId = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        const accountUser = await retrieveData(
          dbInstance,
          SELECT_USER_BY_ID,
          [accountId],
        );

        if (accountUser && accountUser.length > 0) {
          setSecuredStringForKey(PARENT_USER_REMOTE_ID_KEY, accountUser[0].rows.item(0).remote_id);
          return accountUser[0].rows.item(0).remote_id;
        }
        return '';
      }
    } catch (error) {
      logSQL.error('[retrieveParentUserRemoteId] - error:', error);
    }
    return '';
  }, []);

  const retrieveActiveUserDetails = useCallback(async (
    activeUserName: string,
    activeUserType: UserType,
  ) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();
      let activeUserDetailsResponse: PersistedUserSubject;

      if (dbInstance) {
        const activeUserDetails = await retrieveData(
          dbInstance,
          activeUserType === UserType.account
            ? SELECT_USER_BY_USERNAME
            : SELECT_USER_PROFILE_BY_USERNAME,
          [activeUserName],
        );

        if (activeUserDetails && activeUserDetails[0].rows.length > 0) {
          const activeUser = activeUserDetails[0].rows.item(0);
          if (activeUserType === UserType.account) {
            activeUserDetailsResponse = {
              id: activeUser.id,
              remote_id: activeUser.remote_id,
              account_id: activeUser.id,
              name: activeUser.username,
              content_type: activeUser.content_type,
              isSelected: false,
            };
          } else {
            activeUserDetailsResponse = {
              id: activeUser.id,
              remote_id: activeUser.remote_id,
              account_id: activeUser.account_id,
              name: activeUser.username,
              content_type: activeUser.content_type,
              isSelected: false,
            };
          }
        }
      }

      // @ts-ignore
      return activeUserDetailsResponse;
    } catch (error) {
      logSQL.error('[retrieveActiveUserDetails]', error);
    }

    return null;
  }, []);

  return {
    retrieveUserInfo,
    retrieveUserByPin,
    retrieveParentUserRemoteId,
    retrieveUserById,
    retrieveActiveUserDetails,
  };
};
