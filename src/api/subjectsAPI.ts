// Internal Dependencies
import { API_SUBJECT_GROUPS, client } from './EarthRangerService';
import { SubjectGroupResponse } from '../common/types/subjectsResponse';

export const getSubjectGroups = async (accessToken: string, profileId?: string) => {
  const profileIdHeader = profileId ? { 'user-profile': profileId } : null;

  const response = await client(accessToken, profileIdHeader).get<SubjectGroupResponse>(
    `${API_SUBJECT_GROUPS}`,
  );
  return response.data;
};
