// External Dependencies
import axios from 'axios';

// Internal Dependencies
import { SITE_VALUE_KEY } from '../common/constants/constants';
import { getSecuredStringForKey } from '../common/data/storage/utils';
import {
  PatrolType,
  PatrolTypesResponse,
  TrackPatrolByResponse,
} from '../common/types/patrolsResponse';
import {
  API_PATROL_TYPES,
  API_PATROLS,
  API_PATROLS_SEGMENTS,
  API_PATROLS_TRACKED_BY,
  client,
  getApiUrl,
  SITE,
  STATIC_RESOURCES,
  USER_AGENT_VALUE,
} from './EarthRangerService';
import { getIconMarkup } from './reportsAPI';

export const getPatrolTypes = async (accessToken: string, profileId?: string) => {
  const profileIdHeader = profileId ? { 'user-profile': profileId } : null;

  const response = await client(accessToken, profileIdHeader).get<PatrolTypesResponse>(
    `${API_PATROL_TYPES}`,
  );

  return response.data;
};

export const postPatrol = async (accessToken: string, data: any, userProfileId?: string) => {
  const headers: any = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT_VALUE,
  };

  if (userProfileId) {
    headers['user-profile'] = userProfileId || '';
  }

  const response = await axios({
    method: 'POST',
    baseURL: `${SITE.name}${SITE.domain}`,
    url: API_PATROLS,
    headers,
    data: JSON.stringify(data),
  });

  return response.data;
};

export const updatePatrol = async (
  accessToken: string,
  data: any,
  patrolRemoteId: string,
  userProfileId?: string,
) => {
  const headers: any = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT_VALUE,
  };

  if (userProfileId) {
    headers['user-profile'] = userProfileId || '';
  }

  const response = await axios({
    method: 'PATCH',
    baseURL: `${SITE.name}${SITE.domain}`,
    url: `${API_PATROLS}/${patrolRemoteId}`,
    headers,
    data: JSON.stringify(data),
  });

  return response.data;
};

export const getPatrolTrackedBy = async (accessToken: string) => {
  const response = await client(accessToken).get<TrackPatrolByResponse>(
    `${API_PATROLS_TRACKED_BY}`,
  );
  return response.data;
};

export const getPatrolSegment = async (
  accessToken: string,
  patrolSegmentId: string,
  userProfileId?: string,
) => {
  const url = getApiUrl(`${API_PATROLS_SEGMENTS}/${patrolSegmentId}`);

  const headers: any = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT_VALUE,
  };

  if (userProfileId) {
    headers['user-profile'] = userProfileId || '';
  }

  const config = {
    headers,
  };

  const response = await axios.get(url, config);

  return response.status;
};

export const parsePatrolTypes = async (
  patrolTypes: PatrolType[],
  accountId: string,
): Promise<string[][]> => {
  const parsedPatrolTypes: string[][] = [];
  let staticResources = '';
  const host = getSecuredStringForKey(SITE_VALUE_KEY);
  if (host) {
    staticResources = STATIC_RESOURCES.replace('%host%', host);
  }

  for (let i = 0, l = patrolTypes.length; i < l; i++) {
    const patrolType: PatrolType = patrolTypes[i];

    let iconStaticResource = '';
    let iconMarkup: string | null = '';

    if (patrolType.icon_id && staticResources !== '') {
      iconStaticResource = staticResources.replace('%icon%', patrolType.icon_id);
      // eslint-disable-next-line no-await-in-loop
      iconMarkup = await getIconMarkup(iconStaticResource);
    }

    parsedPatrolTypes.push([
      patrolType.id,
      accountId,
      patrolType.value,
      patrolType.display,
      patrolType.icon_id,
      iconMarkup || '',
      patrolType.default_priority.toString(),
      patrolType.is_active.toString() === 'true' ? '1' : '0',
      patrolType.ordernum ? patrolType.ordernum.toString() : '',
    ]);
  }

  return parsedPatrolTypes;
};
