// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import {
  DELETE_PROFILE_BY_ID,
  SELECT_PROFILES,
  SELECT_PROFILE_BY_SUBJECT_ID,
  SELECT_PROFILE_BY_ID,
} from '../sql/queries';
import { logSQL } from '../../utils/logUtils';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedUserProfile } from '../../types/types';
import { getSecuredStringForKey } from '../storage/utils';
import { SUBJECT_ID_KEY } from '../../constants/constants';

export const useRetrieveUserProfiles = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveUserProfiles = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbProfiles = await retrieveData(dbInstance, SELECT_PROFILES, []);
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
            SELECT_PROFILE_BY_SUBJECT_ID,
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

  const deleteUserProfile = useCallback(async (remoteId: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        await retrieveData(
          dbInstance,
          DELETE_PROFILE_BY_ID,
          [remoteId],
        );

        return true;
      }
    } catch (error) {
      logSQL.error('[useRetrieveProfile] - deleteUserProfile: error', error);
    }

    return false;
  }, []);

  const retrieveUserProfileById = useCallback(async (profileId: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        const dbProfiles = await retrieveData(dbInstance, SELECT_PROFILE_BY_ID, [profileId]);

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
    retrieveUserProfiles,
    retrieveUserProfile,
    deleteUserProfile,
    retrieveUserProfileById,
  };
};
