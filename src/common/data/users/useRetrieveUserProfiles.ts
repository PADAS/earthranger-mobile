// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import {
  SELECT_USER_PROFILES,
  SELECT_USER_PROFILE_BY_ID,
  SELECT_USER_PROFILE_BY_SUBJECT_ID,
  DELETE_USER_PROFILE_BY_ID,
  SELECT_USER_PROFILES_REMOTE_ID,
} from '../sql/userQueries';
import { logSQL } from '../../utils/logUtils';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedUserProfile } from '../../types/types';
import { getSecuredStringForKey } from '../storage/utils';
import { SUBJECT_ID_KEY } from '../../constants/constants';
import { UserType } from '../../enums/enums';
import { useRetrieveReportCategories } from '../reports/useRetrieveReportCategories';
import { useExecuteSql, useInsertData } from '../hooks/useInsertData';
import { UPDATE_EVENT_CATEGORY_PROFILE_BY_VALUE, UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE } from '../sql/queries';
import { useRetrieveReportTypes } from '../reports/useRetrieveReportTypes';

export const useRetrieveUserProfiles = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { executeSql } = useExecuteSql();
  const { retrieveData } = useRetrieveData();
  const { retrieveReportCategoriesByUserType } = useRetrieveReportCategories();
  const { retrieveReportCategory } = useRetrieveReportCategories();
  const { retrieveReportTypesByUserType } = useRetrieveReportTypes();
  const { retrieveReportTypesProfileByValue } = useRetrieveReportTypes();

  const retrieveUserProfiles = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbProfiles = await retrieveData(dbInstance, SELECT_USER_PROFILES, []);
        const userProfiles: PersistedUserProfile[] = [];

        if (dbProfiles && dbProfiles.length > 0) {
          for (let i = 0; i < dbProfiles[0].rows.length; i++) {
            userProfiles.push(dbProfiles[0].rows.item(i));
          }
        }
        return userProfiles;
      }
    } catch (error) {
      logSQL.error('[useRetrieveProfiles] - retrieveProfiles: error', error);
    }
    return [];
  }, []);

  const retrieveUserProfilesRemoteID = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbProfiles = await retrieveData(dbInstance, SELECT_USER_PROFILES_REMOTE_ID, []);
        const userProfiles: PersistedUserProfile[] = [];

        if (dbProfiles && dbProfiles.length > 0) {
          for (let i = 0; i < dbProfiles[0].rows.length; i++) {
            userProfiles.push(dbProfiles[0].rows.item(i));
          }
        }
        return userProfiles;
      }
    } catch (error) {
      logSQL.error('[useRetrieveProfiles] - retrieveProfiles: error', error);
    }
    return [];
  }, []);

  const retrieveUserProfile = useCallback(async () => {
    const subjectId = getSecuredStringForKey(SUBJECT_ID_KEY);
    let userProfile: PersistedUserProfile;

    if (subjectId) {
      try {
        // Get database connection instance
        const dbInstance = await getDBInstance();

        if (dbInstance) {
          const dbProfile = await retrieveData(
            dbInstance,
            SELECT_USER_PROFILE_BY_SUBJECT_ID,
            [subjectId],
          );

          if (dbProfile && dbProfile.length > 0) {
            userProfile = dbProfile[0].rows.item(0);
            return userProfile;
          }
        }
      } catch (error) {
        logSQL.error('[useRetrieveProfile] - retrieveProfile: error', error);
      }
    }
    return null;
  }, []);

  const deleteUserProfile = useCallback(async (remoteId: string, profileId: number, permissions: string) => {
    await deleteInUsersProfilesTable(remoteId);
    await deleteInEventCategoryTable(profileId);
    await deleteInEventTypesTable(profileId, permissions);
  }, []);

  const deleteInUsersProfilesTable = async (remoteId: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        await retrieveData(
          dbInstance,
          DELETE_USER_PROFILE_BY_ID,
          [remoteId],
        );

        logSQL.debug('[useRetrieveUserProfiles] - deleted profile in user_profiles table');
        return true;
      }
    } catch (error) {
      // eslint-disable-next-line max-len
      logSQL.error(`[useRetrieveUserProfiles] - profile remote_id ${remoteId} could not be removed from the event_category table: error`, error);
    }
    return false;
  };

  const deleteInEventCategoryTable = async (profileId: number) => {
    const eventCategoriesList = await retrieveReportCategoriesByUserType(
      UserType.profile,
      profileId,
    );

    if (eventCategoriesList.length > 0) {
      try {
      // Get database connection instance
        const dbInstance = await getDBInstance();
        if (dbInstance) {
          for (let i = 0, l = eventCategoriesList.length; i < l; i++) {
          // eslint-disable-next-line no-await-in-loop
            const eventCategory = await retrieveReportCategory(eventCategoriesList[i].value);

            const eventCategoryProfiles = eventCategory?.profile_id;
            if (eventCategoryProfiles) {
              eventCategoryProfiles.splice(
                eventCategoryProfiles.indexOf(profileId),
                1,
              );
            }

            // eslint-disable-next-line no-await-in-loop
            await insertData(
              dbInstance,
              UPDATE_EVENT_CATEGORY_PROFILE_BY_VALUE,
              // @ts-ignore
              [eventCategoryProfiles > 0 ? JSON.stringify(eventCategoryProfiles) : undefined,
                eventCategoriesList[i].value],
            );
          }
          logSQL.debug(`[useRetrieveUserProfiles] - deleted profile ${profileId} in event_category table`);
        }
      } catch {
        // eslint-disable-next-line max-len
        logSQL.error(`[useRetrieveUserProfiles] - profile id ${profileId} could not be removed from the event_category table`);
      }
    }
  };

  const deleteInEventTypesTable = async (profileId: number, permissions: string) => {
    const persistedEventTypes = await retrieveReportTypesByUserType(
      UserType.profile,
      permissions,
      profileId,
    );

    if (persistedEventTypes.length > 0) {
      try {
      // Get database connection instance
        const dbInstance = await getDBInstance();
        if (dbInstance) {
        // eslint-disable-next-line no-restricted-syntax
          for (let i = 0, l = persistedEventTypes.length; i < l; i++) {
          // eslint-disable-next-line no-await-in-loop
            const persistedEventType = await retrieveReportTypesProfileByValue(persistedEventTypes[i].value);
            const profiles = JSON.parse(persistedEventType?.profileId || []);
            profiles.splice(profiles.indexOf(profileId), 1);
            // eslint-disable-next-line no-await-in-loop
            await executeSql(dbInstance, UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE, [
              profiles.length > 0 ? JSON.stringify(profiles) : undefined,
              persistedEventTypes[i].value,
            ]);
          }
          // eslint-disable-next-line max-len
          logSQL.debug(`[useRetrieveUserProfiles] - deleted profile ${profileId} from ${persistedEventTypes.length} in event_types table`);
        }
      } catch {
        // eslint-disable-next-line max-len
        logSQL.error(`[useRetrieveUserProfiles] - profile id ${profileId} could not be removed from the event_type table`);
      }
    }
  };

  const retrieveUserProfileById = useCallback(async (profileId: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbProfiles = await retrieveData(dbInstance, SELECT_USER_PROFILE_BY_ID, [profileId]);

        if (dbProfiles && dbProfiles.length > 0) {
          return dbProfiles[0].rows.item(0) as PersistedUserProfile;
        }
        return null;
      }
    } catch (error) {
      logSQL.error('[useRetrieveProfiles] - retrieveUserProfileById: error', error);
    }
    return null;
  }, []);

  return {
    deleteUserProfile,
    retrieveUserProfile,
    retrieveUserProfileById,
    retrieveUserProfiles,
    retrieveUserProfilesRemoteID,
  };
};
