// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { SubjectGroupResponse } from '../../types/subjectsResponse';
import { getSubjectGroups } from '../../../api/subjectsAPI';

export const useRetrieveRemoteSubjectGroups = () => {
  const retrieveRemoteSubjectGroups = useCallback(async (accessToken: string, profileId?: string): Promise<SubjectGroupResponse | null> => {
    let subjectGroupsResponse: SubjectGroupResponse | null = null;

    try {
      // Get subject groups from API
      subjectGroupsResponse = await getSubjectGroups(accessToken, profileId);
    } catch (error) {
      if (error instanceof Error) {
        throw Error(error.message);
      } else if (typeof error === 'string') {
        throw Error(error);
      }
    }

    return subjectGroupsResponse;
  }, []);

  return { retrieveRemoteSubjectGroups };
};
