// External Dependencies
import { useCallback } from 'react';
import { difference } from 'lodash-es';

// Internal Dependencies
import { useGetDBConnection } from '../common/data/PersistentStore';
import { useRetrieveData } from '../common/data/hooks/useRetrieveData';
import { useRetrieveReportTypes } from '../common/data/reports/useRetrieveReportTypes';
import { getReportCategories, getReportTypes } from './reportsAPI';
import { PersistedEventType, PersistedPatrolType } from '../common/types/types';
import { Category, Type } from '../common/types/reportsResponse';
import {
  DELETE_PATROL_TYPE_BY_ID,
  UPDATE_EVENT_TYPE_ACCOUNT_ID_BY_VALUE,
  UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE,
} from '../common/data/sql/queries';
import { logSQL, logSync } from '../common/utils/logUtils';
import { usePopulateReportCategories } from '../common/data/reports/usePopulateReportCategories';
import {
  API_EVENT_TYPES, API_PATROL_TYPES, API_USER_ME, client,
} from './EarthRangerService';
import { User } from '../common/types/usersResponse';
import { usePopulatePatrolTypes } from '../common/data/patrols/usePopulatePatrolTypes';
import { getPatrolTypes } from './patrolsAPI';
import { useRetrievePatrolTypes } from '../common/data/patrols/useRetrievePatrolTypes';
import { PatrolType } from '../common/types/patrolsResponse';
import { getRemoteUser, getUserProfiles } from './usersAPI';
import { getSecuredStringForKey } from '../common/data/storage/utils';
import {
  ACTIVE_USER_HAS_PATROLS_PERMISSION,
  ACTIVE_USER_NAME_KEY,
  USER_REMOTE_ID_KEY,
} from '../common/constants/constants';
import { usePopulateUsers } from '../common/data/users/usePopulateUsers';
import { getListsDiff, setIsSyncing, SyncSource } from '../common/utils/syncUtils';
import { useRetrieveUserProfiles } from '../common/data/users/useRetrieveUserProfiles';
import { isParentUserActive, setAuthState } from '../common/utils/authUtils';
import { getBoolForKey } from '../common/data/storage/keyValue';
import { AuthState, UserType } from '../common/enums/enums';
import { useRetrieveUser } from '../common/data/users/useRetrieveUser';
import { useExecuteSql } from '../common/data/hooks/useInsertData';
import { usePopulateReportTypes } from '../common/data/reports/usePopulateReportTypes';
import { useRetrieveReportCategories } from '../common/data/reports/useRetrieveReportCategories';

const isUnauthorizedError = (error: any) => error.toString().includes('401');

// ------------------------------------------------------------------------
// public functions
// ------------------------------------------------------------------------

export enum SyncScope {
  Schema = 'events_schema',
  Users = 'users',
  Profiles = 'profiles',
  EventTypes = 'event_types',
  PatrolTypes = 'patrol_types',
}

export const getSyncStateScope = async (accessToken: string, type: SyncScope) => {
  // Endpoint to query
  let endpoint = null;

  switch (type) {
    case SyncScope.EventTypes:
      endpoint = API_EVENT_TYPES;
      break;
    case SyncScope.Users:
    case SyncScope.Profiles:
      endpoint = API_USER_ME;
      break;
    case SyncScope.PatrolTypes:
      if (getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION)) {
        endpoint = API_PATROL_TYPES;
      }
      break;
    default:
      break;
  }

  if (endpoint) {
    try {
      const response = await client(accessToken, getProfileIdHeader()).get(endpoint);
      return response.headers.etag || '500';
    } catch (error: any) {
      logSync.error(`[SyncService] - Could not get remote sync scope for ${type} - ${error}`);

      if (isUnauthorizedError(error)) {
        return '401';
      }
    }
  }

  return '500';
};

const getProfileIdHeader = () => (isParentUserActive()
  ? {}
  : { 'user-profile': getSecuredStringForKey(USER_REMOTE_ID_KEY || '') });

// ------------------------------------------------------------------------
// public hooks
// ------------------------------------------------------------------------

export const useOnSynchronizeData = () => {
  // hooks
  const { retrieveReportTypesByUserType } = useRetrieveReportTypes();
  const { retrievePatrolTypes } = useRetrievePatrolTypes();
  const { onSynchronizeEventCategories } = useOnSynchronizeEventCategories();
  const { onSynchronizePatrolTypes } = useOnSynchronizePatrolTypes();
  const { onSynchronizeUserProfiles } = useOnSynchronizeUserProfiles();
  const { onSynchronizeAccount } = useOnSynchronizeAccount();
  const { deleteProfilesNotInRemote } = useDeleteProfilesNotInRemote();
  const { retrieveUserProfiles } = useRetrieveUserProfiles();
  const { retrieveUserInfo } = useRetrieveUser();
  const { unlinkReportTypes } = useUnlinkReportTypes();
  const { upsertReportTypes } = usePopulateReportTypes();
  const {
    upsertReportCategoriesForProfiles,
    updateReportCategories,
  } = usePopulateReportCategories();
  const { retrieveReportCategoriesByUserType } = useRetrieveReportCategories();

  const onSynchronizeProfiles = useCallback(async (accessToken: string) => {
    setIsSyncing(SyncSource.LocalDB, true);
    // Sync User Profiles
    logSync.info('[Start Sync] - User Profiles');

    // Get User ID
    const userID = getSecuredStringForKey(USER_REMOTE_ID_KEY || '');

    if (userID && isParentUserActive()) { // Only parent user can sync profiles
      let userProfiles;
      let activeProfileExists = true;

      try {
        userProfiles = await getUserProfiles(accessToken, userID);

        const didDeleteProfiles = await deleteProfilesNotInRemote(userProfiles.data);

        if (didDeleteProfiles) {
          const localUserProfiles = await retrieveUserProfiles();

          activeProfileExists = localUserProfiles.some(
            // eslint-disable-next-line max-len
            (localUserProfile) => localUserProfile.username === getSecuredStringForKey(ACTIVE_USER_NAME_KEY),
          );
        }
      } catch (error: any) {
        logSync.error(`[SyncService] - Could not sync report categories from server - ${error}`);
        setIsSyncing(SyncSource.LocalDB, false);
        if (isUnauthorizedError(error)) return error;
      }

      if (userProfiles) {
        await onSynchronizeUserProfiles(userProfiles.data, accessToken);
      }
      setIsSyncing(SyncSource.LocalDB, false);

      if (!activeProfileExists) {
        setAuthState(AuthState.userInvalidated);
      }
    }

    return null;
  }, []);

  const onSynchronizeUser = useCallback(async (accessToken: string) => {
    setIsSyncing(SyncSource.LocalDB, true);
    // Sync User Profiles
    logSync.info('[Start Sync] - User Account');

    const profileRemoteId = isParentUserActive() ? '' : getSecuredStringForKey(USER_REMOTE_ID_KEY) || '';

    let user;
    try {
      user = await getRemoteUser(accessToken, profileRemoteId);
    } catch (error: any) {
      logSync.error(`[SyncService] - Could not sync user from server - ${error}`);
      setIsSyncing(SyncSource.LocalDB, false);
      if (isUnauthorizedError(error)) return error;
    }

    if (user) {
      if (profileRemoteId) {
        await onSynchronizeUserProfiles([user.data], accessToken);
      } else {
        await onSynchronizeAccount(user.data, accessToken);
      }
    }
    setIsSyncing(SyncSource.LocalDB, false);

    return null;
  }, []);

  const onSynchronizeEventsCategories = useCallback(async (
    accessToken: string,
    // eslint-disable-next-line consistent-return
  ) => {
    setIsSyncing(SyncSource.LocalDB, true);
    // sync event categories
    logSync.info('[Start Sync] - Report Categories');
    const userInfo = await retrieveUserInfo();

    if (userInfo?.userType === UserType.account) {
      let reportCategories;
      let reportCategoriesToDisable;

      try {
        reportCategories = await getReportCategories(accessToken);
        const existingReportCategories = await retrieveReportCategoriesByUserType(UserType.account);
        reportCategoriesToDisable = getListsDiff(
          existingReportCategories,
          reportCategories.data,
        );
      } catch (error: any) {
        logSync.error(`[SyncService] - Could not sync report categories from server - ${error}`);
        setIsSyncing(SyncSource.LocalDB, false);
        if (isUnauthorizedError(error)) return error;
      }

      if (reportCategories) {
        await onSynchronizeEventCategories(reportCategories.data);
        if (reportCategoriesToDisable) {
          await updateReportCategories(reportCategoriesToDisable);
        }
      }
    } else {
      await upsertReportCategoriesForProfiles(accessToken);
    }

    setIsSyncing(SyncSource.LocalDB, false);
  }, []);

  const onSynchronizeEventsTypes = useCallback(async (
    accessToken: string,
    onReportTypeError?: (reportType: string) => void,
  ) => {
    setIsSyncing(SyncSource.LocalDB, true);
    logSync.info('[Start Sync] - Event Types');

    const userInfo = await retrieveUserInfo();
    const userId = userInfo?.userId || '';
    const userType = userInfo?.userType || UserType.account;
    const profileId = (userType === UserType.profile) ? getSecuredStringForKey(USER_REMOTE_ID_KEY) : '';
    let reportTypes;

    try {
      reportTypes = await getReportTypes(accessToken, profileId);
    } catch (error: any) {
      logSync.error(`[SyncService] - Could not sync report events types from server - ${error}`);
      setIsSyncing(SyncSource.LocalDB, false);
      if (isUnauthorizedError(error)) {
        return error;
      }
    }

    if (reportTypes) {
      const persistedEventTypes = await retrieveReportTypesByUserType(userType, parseInt(profileId || '0', 10));
      const validRemoteReportTypes = reportTypes.data.filter((type) => !type.readonly && !type.is_collection && type.category.flag !== 'system');
      await unlinkReportTypes(
        persistedEventTypes,
        validRemoteReportTypes,
        parseInt(userId, 10),
        userType,
      );
      await upsertReportTypes(
        reportTypes.data,
        accessToken,
        { id: parseInt(userId, 10), type: userType, permissions: userInfo?.permissions || '' },
        onReportTypeError,
      );
    }

    setIsSyncing(SyncSource.LocalDB, false);
    return null;
  }, []);

  const onSyncPatrolTypes = useCallback(async (
    accessToken: string,
  ) => {
    setIsSyncing(SyncSource.LocalDB, true);
    logSync.info('[Start Sync] - Patrol Types');

    let patrolTypes;
    try {
      // Get User's type info
      const userInfo = await retrieveUserInfo();
      let profileId;

      if (userInfo) {
        profileId = userInfo.userType === UserType.profile
          ? getSecuredStringForKey(USER_REMOTE_ID_KEY)
          : undefined;
      }
      patrolTypes = await getPatrolTypes(accessToken, profileId);
    } catch (error: any) {
      logSync.error(`[SyncService] - Could not sync patrol types from server - ${error}`);
      setIsSyncing(SyncSource.LocalDB, false);
      if (isUnauthorizedError(error)) {
        return error;
      }
    }

    if (patrolTypes) {
      const persistedPatrolTypes = await retrievePatrolTypes();
      await onSynchronizePatrolTypes(
        persistedPatrolTypes,
        patrolTypes.data,
      );
    }

    setIsSyncing(SyncSource.LocalDB, false);
    return null;
  }, []);

  return {
    onSynchronizeUser,
    onSynchronizeProfiles,
    onSynchronizeEventsCategories,
    onSynchronizeEventsTypes,
    onSyncPatrolTypes,
  };
};

// ------------------------------------------------------------------------
// local hooks
// ------------------------------------------------------------------------

const useOnSynchronizeUserProfiles = () => {
  const { upsertUserProfiles } = usePopulateUsers();

  const onSynchronizeUserProfiles = useCallback(async (
    remoteUserProfiles: User[],
    accessToken: string,
  ) => {
    if (remoteUserProfiles.length > 0) {
      await upsertUserProfiles(accessToken, remoteUserProfiles);
    }
  }, []);

  return { onSynchronizeUserProfiles };
};

const useDeleteProfilesNotInRemote = () => {
  const { retrieveUserProfiles, deleteUserProfile } = useRetrieveUserProfiles();

  const deleteProfilesNotInRemote = useCallback(async (remoteUserProfiles: User[]) => {
    const persistedUserProfiles = await retrieveUserProfiles();

    const remoteUserProfilesIds: string[] = remoteUserProfiles.map(
      (remoteUserProfile) => remoteUserProfile.id,
    );
    const persistedUserProfilesIds: string[] = persistedUserProfiles.map(
      (persistedUserProfile) => persistedUserProfile.remote_id,
    );

    const profilesDifference = difference(persistedUserProfilesIds, remoteUserProfilesIds);

    if (profilesDifference.length > 0) {
      for (let i = 0, l = profilesDifference.length; i < l; i++) {
        // eslint-disable-next-line no-await-in-loop
        await deleteUserProfile(profilesDifference[i]);
      }

      return true;
    }

    return false;
  }, []);

  return { deleteProfilesNotInRemote };
};

const useOnSynchronizeAccount = () => {
  const { upsertUsers } = usePopulateUsers();

  const onSynchronizeAccount = useCallback(async (
    user: User,
    accessToken: string,
  ) => {
    if (user) {
      await upsertUsers(accessToken, user);
    }
  }, []);

  return { onSynchronizeAccount };
};

const useOnSynchronizeEventCategories = () => {
  const { upsertReportCategories } = usePopulateReportCategories();

  const onSynchronizeEventCategories = useCallback(async (remoteReportCategories: Category[]) => {
    if (remoteReportCategories.length > 0) {
      await upsertReportCategories(remoteReportCategories);
    }
  }, []);

  return { onSynchronizeEventCategories };
};

const useUnlinkReportTypes = () => {
  const { getDBInstance } = useGetDBConnection();
  const { executeSql } = useExecuteSql();
  const { retrieveReportTypesProfileByValue } = useRetrieveReportTypes();

  const unlinkReportTypes = useCallback(async (
    localReportTypes: PersistedEventType[],
    remoteReportTypes: Type[],
    userId: number,
    userType: UserType,
  ) => {
    const persistedRemoteIds = localReportTypes.map((type) => type.value);
    const remoteIds = remoteReportTypes.map((type) => type.value);

    const diff = difference(persistedRemoteIds, remoteIds);
    if (diff.length > 0) {
      // Get database connection instance
      const dbInstance = await getDBInstance();
      if (dbInstance) {
        // eslint-disable-next-line no-restricted-syntax
        for (const value of diff) {
          if (userType === UserType.account) {
            // eslint-disable-next-line no-await-in-loop
            await executeSql(dbInstance, UPDATE_EVENT_TYPE_ACCOUNT_ID_BY_VALUE, [
              undefined,
              value,
            ]);
          } else {
            // eslint-disable-next-line no-await-in-loop
            const persistedReportType = await retrieveReportTypesProfileByValue(value);
            const profiles = JSON.parse(persistedReportType?.profileId || []);
            profiles.splice(profiles.indexOf(userId), 1);
            // eslint-disable-next-line no-await-in-loop
            await executeSql(dbInstance, UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE, [
              profiles.length > 0 ? JSON.stringify(profiles) : undefined,
              value,
            ]);
          }
        }
        logSQL.info(`Unlinked ${diff.length} report types from database`);
      }
    }
  }, []);

  return { unlinkReportTypes };
};

const useOnSynchronizePatrolTypes = () => {
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { upsertPatrolTypes } = usePopulatePatrolTypes();

  const onSynchronizePatrolTypes = useCallback(async (
    persistedPatrolTypes: PersistedPatrolType[],
    remotePatrolTypes: PatrolType[],
  ) => {
    if (remotePatrolTypes.length > 0) {
      const persistedRemoteIds = persistedPatrolTypes.map((patrolType) => patrolType.remote_id);
      const remoteIds = remotePatrolTypes.map((patrolType) => patrolType.id);

      const diff = difference(persistedRemoteIds, remoteIds);

      if (diff.length > 0) {
        // Get database connection instance
        const dbInstance = await getDBInstance();

        if (dbInstance) {
          // eslint-disable-next-line no-restricted-syntax
          for (const value of diff) {
            // eslint-disable-next-line no-await-in-loop
            await retrieveData(dbInstance, DELETE_PATROL_TYPE_BY_ID, [value]);
          }
          logSQL.info(`Removed ${diff.length} patrol types from database`);
        }
      }

      await upsertPatrolTypes(remotePatrolTypes);
    }
  }, []);

  return { onSynchronizePatrolTypes };
};
