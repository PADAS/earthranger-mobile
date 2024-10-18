// External Dependencies
import { useCallback } from 'react';
import { difference } from 'lodash-es';

// Internal Dependencies
import { useGetDBConnection } from '../common/data/PersistentStore';
import { useRetrieveData } from '../common/data/hooks/useRetrieveData';
import { useRetrieveReportTypes } from '../common/data/reports/useRetrieveReportTypes';
import { getReportCategories, getReportTypes } from './reportsAPI';
import {
  PersistedEventType,
  PersistedPatrolType,
  PersistedUserProfile,
  SubjectGroupSyncItem,
  SubjectSyncItem,
} from '../common/types/types';
import { Category, Type } from '../common/types/reportsResponse';
import {
  DELETE_EVENT_TYPES_BY_VALUE,
  DELETE_PATROL_TYPE_BY_ID,
  UPDATE_EVENT_TYPE_ACCOUNT_ID_BY_VALUE,
  UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE,
} from '../common/data/sql/queries';
import { logSQL, logSync } from '../common/utils/logUtils';
import { usePopulateReportCategories } from '../common/data/reports/usePopulateReportCategories';
import {
  API_EVENT_TYPES, API_PATROL_TYPES, API_SCHEMA, API_USER_ME, client,
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
  USER_ID_KEY,
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
import { useRetrieveRemoteSubjectGroups } from '../common/data/subjects/useRetrieveRemoteSubjectGroups';
import { useDownloadSubjectGroups } from '../common/data/subjects/useDownloadSubjectGroups';
import { SubjectGroup as SubjectGroupResponse } from '../common/types/subjectsResponse';
import { getIconSVGMarkup } from '../common/utils/iconsUtils';
import { cleanUpSvg } from '../common/utils/svgIconsUtils';
import {
  DELETE_SUBJECT,
  DELETE_SUBJECT_GROUP,
  SELECT_SUBJECTS_REMOTE_IDS,
  SELECT_ALL_SUBJECT_GROUPS,
  SELECT_SUBJECT_GROUP_BY_REMOTE_ID,
  UPSERT_SUBJECT,
  UPSERT_SUBJECT_GROUP,
  SELECT_SUBJECT_BY_REMOTE_ID,
  INSERT_SUBJECT_GROUP_MEMBERSHIP,
  DELETE_MEMBERSHIPS,
  DELETE_PROFILE_SUBJECT_GROUPS,
} from '../common/data/sql/subjectQueries';
import subjectsStorage from '../common/data/storage/subjectsStorage';

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
  Subjects = 'subjects',
}

export const getSyncStateScope = async (accessToken: string, type: SyncScope) => {
  // Endpoint to query
  let endpoint = null;

  switch (type) {
    case SyncScope.Schema:
      endpoint = API_SCHEMA;
      break;
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
  const { retrieveUserProfilesRemoteID } = useRetrieveUserProfiles();
  const { retrieveUserInfo } = useRetrieveUser();
  const { unlinkReportTypes } = useUnlinkReportTypes();
  const { upsertReportTypes } = usePopulateReportTypes();
  const {
    upsertReportCategoriesForProfiles,
    updateReportCategories,
  } = usePopulateReportCategories();
  const { retrieveReportCategoriesByUserType } = useRetrieveReportCategories();
  const { onSynchronizeEventTypes } = useOnSynchronizeEventTypes();
  const { retrieveRemoteSubjectGroups } = useRetrieveRemoteSubjectGroups();
  const { onSynchronizeSubjects } = useOnSynchronizeSubjects();

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
    const profileRemoteId = (userType === UserType.profile) ? getSecuredStringForKey(USER_REMOTE_ID_KEY) : '';
    const profileId = userInfo?.userType === UserType.profile ? parseInt(userInfo.userId || '', 10) : undefined;
    let reportTypes;

    try {
      reportTypes = await getReportTypes(accessToken, profileRemoteId);
    } catch (error: any) {
      logSync.error(`[SyncService] - Could not sync report events types from server - ${error}`);
      setIsSyncing(SyncSource.LocalDB, false);
      if (isUnauthorizedError(error)) {
        return error;
      }
    }

    if (reportTypes) {
      const persistedEventTypes = await retrieveReportTypesByUserType(
        userType,
        userInfo?.permissions,
        profileId,
      );
      const validRemoteReportTypes = reportTypes.data.filter(
        (type) => !type.readonly && !type.is_collection && type.category.flag !== 'system',
      );
      await unlinkReportTypes(
        persistedEventTypes,
        validRemoteReportTypes,
        parseInt(userId, 10),
        userType,
      );

      await onSynchronizeEventTypes(reportTypes.data, persistedEventTypes);

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

  const onSyncSubjects = useCallback(async (
    accessToken: string,
  ) => {
    setIsSyncing(SyncSource.LocalDB, true);
    logSync.info('[Start Sync] - Subjects');

    let subjects: SubjectGroupResponse[] = [];

    try {
      const rawData = await retrieveRemoteSubjectGroups(accessToken);

      if (rawData && rawData.data && rawData.data.length > 0) {
        subjects = rawData.data;
      }
    } catch (error: any) {
      logSync.error(`[SyncService] - Could not sync subjects from server - ${error}`);

      setIsSyncing(SyncSource.LocalDB, false);

      if (isUnauthorizedError(error)) {
        return error;
      }
    }

    if (subjects) {
      const profileIds = await retrieveUserProfilesRemoteID();

      await onSynchronizeSubjects(accessToken, subjects, profileIds);
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
    onSyncSubjects,
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

    const profilesToBeRemoved = persistedUserProfiles.filter((e) => profilesDifference.includes(e.remote_id));

    if (profilesToBeRemoved.length > 0) {
      for (let i = 0, l = profilesToBeRemoved.length; i < l; i++) {
        // eslint-disable-next-line no-await-in-loop
        await deleteUserProfile(
          profilesToBeRemoved[i].remote_id,
          profilesToBeRemoved[i].id,
          profilesToBeRemoved[i].permissions,
        );
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

const useOnSynchronizeEventTypes = () => {
  const { getDBInstance } = useGetDBConnection();
  const { executeSql } = useExecuteSql();

  const onSynchronizeEventTypes = useCallback(async (
    remoteEventTypes: Type[],
    localEventTypes: PersistedEventType[],
  ) => {
    const localEventTypeValues = localEventTypes.map((item) => item.value);
    const remoteEventTypeValues = remoteEventTypes.map((item) => item.value);

    const diff = difference(localEventTypeValues, remoteEventTypeValues);

    if (diff.length > 0) {
      // Get database connection instance
      const dbInstance = await getDBInstance();
      if (dbInstance) {
        for (let i = 0, l = diff.length; i < l; i++) {
          const inactiveEventType = diff[i];

          // eslint-disable-next-line no-await-in-loop
          await executeSql(
            dbInstance,
            DELETE_EVENT_TYPES_BY_VALUE,
            [inactiveEventType],
          );
        }
      }
    }
  }, []);

  return {
    onSynchronizeEventTypes,
  };
};

const useOnSynchronizeSubjects = () => {
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { executeSql } = useExecuteSql();
  const { processProfileSubjectGroups } = useDownloadSubjectGroups();

  const traverseTree = useCallback(async (
    subjectGroups: SubjectGroupResponse[],
    subjectGroupsTmp: SubjectGroupSyncItem[],
    subjectsTmp: SubjectSyncItem[],
    memberships: [string, string][],
    parentGroupId?: string,
  ) => {
    for (let i = 0, l = subjectGroups.length; i < l; i++) {
      const item = subjectGroups[i];

      subjectGroupsTmp.push({
        remoteId: item.id,
        name: item.name,
        parentId: parentGroupId,
      });

      if (item.subgroups.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await traverseTree(
          item.subgroups,
          subjectGroupsTmp,
          subjectsTmp,
          memberships,
          item.id,
        );
      }

      if (item.subjects.length > 0) {
        for (let j = 0, k = item.subjects.length; j < k; j++) {
          const subjectItemTmp = item.subjects[j];

          // eslint-disable-next-line no-await-in-loop
          const iconSVG = await getIconSVGMarkup(subjectItemTmp.image_url) || '';
          let xml = '';
          if (iconSVG) {
            xml = cleanUpSvg(iconSVG);
          }

          subjectsTmp.push({
            remoteId: subjectItemTmp.id,
            name: subjectItemTmp.name,
            isActive: subjectItemTmp.is_active ? '1' : '0',
            updatedAt: subjectItemTmp.updated_at,
            tracksAvailable: subjectItemTmp.tracks_available ? '1' : '0',
            lastPositionDate: subjectItemTmp.last_position_date,
            lastPosition: JSON.stringify(subjectItemTmp.last_position),
            iconSVG: xml,
          });

          let membershipExists = false;

          for (let f = 0, m = memberships.length; f < m; f++) {
            const membership = memberships[f];

            membershipExists = membership[0] === item.id && membership[1] === subjectItemTmp.id;

            if (membershipExists) {
              break;
            }
          }

          if (!membershipExists) {
            memberships.push([item.id, subjectItemTmp.id]);
          }
        }
      }
    }
  }, []);

  const onSynchronizeSubjectGroups = useCallback(async (
    accessToken: string,
    subjectGroups: SubjectGroupSyncItem[],
    profileIds: PersistedUserProfile[],
  ) => {
    logSync.info('[Start Sync] - Subject Groups');
    const localSubjectGroups = [];
    const remoteSubjectGroups = subjectGroups.map((item) => item.remoteId);

    // Get database connection instance
    try {
      const dbInstance = await getDBInstance();
      if (dbInstance) {
        const result = await retrieveData(
          dbInstance,
          SELECT_ALL_SUBJECT_GROUPS,
          [],
        );

        if (result && result[0] && result[0].rows.length > 0) {
          for (let i = 0, l = result[0].rows.length; i < l; i++) {
            localSubjectGroups.push(result[0].rows.item(i).remote_id);
          }
        }

        const diff = difference(localSubjectGroups, remoteSubjectGroups);

        // Use case: a subject group was removed from web
        if (diff.length > 0) {
          for (let i = 0, l = diff.length; i < l; i++) {
            const subjectGroupToDelete = diff[i];

            // eslint-disable-next-line no-await-in-loop
            await retrieveData(dbInstance, DELETE_SUBJECT_GROUP, [subjectGroupToDelete]);
          }
        }

        // Use case: a subject group was reordered, or name was changed
        for (let i = 0, l = subjectGroups.length; i < l; i++) {
          const currSubjectGroup = subjectGroups[i];

          if (currSubjectGroup.parentId) {
            // eslint-disable-next-line no-await-in-loop
            const subject = await retrieveData(
              dbInstance,
              SELECT_SUBJECT_GROUP_BY_REMOTE_ID,
              [currSubjectGroup.parentId],
            );

            if (subject && subject[0] && subject[0].rows.length > 0) {
              currSubjectGroup.parentLocalId = subject[0].rows.item(0).id;
            }
          } else {
            currSubjectGroup.parentLocalId = undefined;
          }

          // eslint-disable-next-line no-await-in-loop
          await executeSql(
            dbInstance,
            UPSERT_SUBJECT_GROUP,
            [
              currSubjectGroup.remoteId,
              getSecuredStringForKey(USER_ID_KEY) || '',
              currSubjectGroup.parentLocalId,
              currSubjectGroup.name,
            ],
          );
        }
        // rehydrate profile_subject_groups
        await executeSql(
          dbInstance,
          DELETE_PROFILE_SUBJECT_GROUPS,
          [],
        );

        // eslint-disable-next-line no-restricted-syntax
        for (const profileId of profileIds) {
          // eslint-disable-next-line no-await-in-loop
          await processProfileSubjectGroups(accessToken, profileId.id, profileId.remote_id);
        }
      }
    } catch (error) {
      logSync.error(`[SyncService] - Could not sync subject groups from server - ${JSON.stringify(error)}`);
    }

    logSync.info('[End Subject groups updates] - Subject Groups');
  }, []);

  const onSynchronizeSubjectItems = useCallback(async (subjects: SubjectSyncItem[]) => {
    logSync.info('[Start Sync] - Subjects');
    // @ts-ignore
    subjectsStorage.subjectsKey.set(JSON.stringify('[]'));
    const localSubjects = [];
    const remoteSubjects = subjects.map((item) => item.remoteId);

    // Get database connection instance
    try {
      const dbInstance = await getDBInstance();
      if (dbInstance) {
        const result = await retrieveData(
          dbInstance,
          SELECT_SUBJECTS_REMOTE_IDS,
          [],
        );

        if (result && result[0] && result[0].rows.length > 0) {
          for (let i = 0, l = result[0].rows.length; i < l; i++) {
            localSubjects.push(result[0].rows.item(i).remote_id);
          }
        }

        const diff = difference(localSubjects, remoteSubjects);

        // Use case: a subject was removed from web
        if (diff.length > 0) {
          for (let i = 0, l = diff.length; i < l; i++) {
            const subjectToDelete = diff[i];

            // eslint-disable-next-line no-await-in-loop
            await retrieveData(dbInstance, DELETE_SUBJECT, [subjectToDelete]);
          }
        }

        // Use case: a subject's info changed
        for (let i = 0, l = subjects.length; i < l; i++) {
          const currSubject = subjects[i];

          // eslint-disable-next-line no-await-in-loop
          await executeSql(
            dbInstance,
            UPSERT_SUBJECT,
            [
              currSubject.remoteId,
              currSubject.name,
              currSubject.isActive ? '1' : '0',
              currSubject.tracksAvailable ? '1' : '0',
              currSubject.lastPosition,
              currSubject.lastPositionDate,
              currSubject.iconSVG,
              currSubject.updatedAt,
            ],
          );
        }
      }
    } catch (error) {
      logSync.error(`[SyncService] - Could not sync subjects from server - ${JSON.stringify(error)}`);
    }

    // @ts-ignore
    subjectsStorage.subjectsKey.set(JSON.stringify(remoteSubjects));

    logSync.info('[End Subjects updates] - Subjects');
  }, []);

  const onSynchronizeSubjectsMemberships = useCallback(async (memberships: [string, string][]) => {
    logSync.info('[Start Sync] - Subject Group Memberships');

    // Get database connection instance
    try {
      const dbInstance = await getDBInstance();
      if (dbInstance) {
        await executeSql(
          dbInstance,
          DELETE_MEMBERSHIPS,
          [],
        );

        for (let i = 0, l = memberships.length; i < l; i++) {
          const currMembership = memberships[i];
          let subjectGroupId = 0;
          let subjectId = 0;

          // eslint-disable-next-line no-await-in-loop
          const subjectGroupData = await retrieveData(
            dbInstance,
            SELECT_SUBJECT_GROUP_BY_REMOTE_ID,
            [currMembership[0]],
          );

          if (subjectGroupData && subjectGroupData[0] && subjectGroupData[0].rows.length === 1) {
            subjectGroupId = subjectGroupData[0].rows.item(0).id;
          }

          // eslint-disable-next-line no-await-in-loop
          const subjectData = await retrieveData(
            dbInstance,
            SELECT_SUBJECT_BY_REMOTE_ID,
            [currMembership[1]],
          );

          if (subjectData && subjectData[0] && subjectData[0].rows.length === 1) {
            subjectId = subjectData[0].rows.item(0).id;
          }

          // eslint-disable-next-line no-await-in-loop
          await executeSql(
            dbInstance,
            INSERT_SUBJECT_GROUP_MEMBERSHIP,
            [
              subjectGroupId.toString(),
              subjectId.toString(),
            ],
          );
        }
      }
    } catch (error) {
      logSync.error(`[SyncService] - Could not sync subjects memberships from server - ${JSON.stringify(error)}`);
    }

    logSync.info('[End Subjects memberships updates] - Subject Group Memberships');
  }, []);

  const onSynchronizeSubjects = useCallback(async (
    accessToken: string,
    subjectsData: SubjectGroupResponse[],
    profileIds: PersistedUserProfile[],
  ) => {
    const subjectGroups: SubjectGroupSyncItem[] = [];
    const subjects: SubjectSyncItem[] = [];
    const memberships: [string, string][] = [];

    await traverseTree(
      subjectsData,
      subjectGroups,
      subjects,
      memberships,
    );

    await onSynchronizeSubjectGroups(accessToken, subjectGroups, profileIds);
    await onSynchronizeSubjectItems(subjects);
    await onSynchronizeSubjectsMemberships(memberships);
  }, []);

  return { onSynchronizeSubjects };
};
