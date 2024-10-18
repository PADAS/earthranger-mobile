// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useRetrieveRemoteSubjectGroups } from './useRetrieveRemoteSubjectGroups';
import { usePopulateSubjectGroups } from './usePopulateSubjectGroups';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { useRetrieveUserProfiles } from '../users/useRetrieveUserProfiles';
import { useRetrieveSubjects } from './useRetrieveSubjects';
import { flattenSubjectGroups } from '../../utils/subjectUtils';

export const useDownloadSubjectGroups = () => {
  // Hooks
  const { retrieveRemoteSubjectGroups } = useRetrieveRemoteSubjectGroups();
  const { populateProfileSubjectGroups, populateSubjectGroups } = usePopulateSubjectGroups();
  const { retrieveUserInfo } = useRetrieveUser();
  const { retrieveUserProfilesRemoteID } = useRetrieveUserProfiles();
  const { retrieveLocalSubjectGroupIds } = useRetrieveSubjects();

  const processProfileSubjectGroups = useCallback(async (
    accessToken: string,
    profileId: number,
    profileRemoteId: string,
  ): Promise<void> => {
    const response = await retrieveRemoteSubjectGroups(accessToken, profileRemoteId);

    if (response && response.data && response.data.length > 0) {
      const flattenedGroups = flattenSubjectGroups(response.data);
      const localGroupIds = await retrieveLocalSubjectGroupIds(flattenedGroups);

      // Only update profile_subject_groups table for profile users
      await populateProfileSubjectGroups(profileId, localGroupIds);
    }
  }, []);

  const downloadSubjectGroups = useCallback(async (accessToken: string): Promise<void> => {
    try {
      // Get User's type info
      const userInfo = await retrieveUserInfo();

      if (userInfo) {
        const subjectGroups = await retrieveRemoteSubjectGroups(accessToken);

        if (subjectGroups && subjectGroups.data && subjectGroups.data.length > 0) {
          await populateSubjectGroups(subjectGroups.data);
        }

        const profileIds = await retrieveUserProfilesRemoteID();
        // eslint-disable-next-line no-restricted-syntax
        for (const profileId of profileIds) {
          // eslint-disable-next-line no-await-in-loop
          await processProfileSubjectGroups(accessToken, profileId.id, profileId.remote_id);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw Error(error.message);
      } else if (typeof error === 'string') {
        throw Error(error);
      }
    }
  }, []);

  return { downloadSubjectGroups, processProfileSubjectGroups };
};
