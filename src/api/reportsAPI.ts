// External Dependencies
import axios from 'axios';
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import {
  Category,
  ReportCategoriesResponse,
  ReportTypeSchemaResponse,
  ReportTypesResponse,
  Type,
} from '../common/types/reportsResponse';
import {
  API_ATTACHMENT_NOTES,
  API_EVENT,
  API_EVENTS,
  API_EVENT_TYPES,
  API_EVENT_CATEGORIES,
  STATIC_RESOURCES,
  getApiUrl,
  client,
  SITE, API_SCHEMA,
  API_PATROLS_SEGMENTS,
  API_PATROLS_EVENTS,
  USER_AGENT_VALUE,
} from './EarthRangerService';
import { SITE_VALUE_KEY } from '../common/constants/constants';
import { getSecuredStringForKey } from '../common/data/storage/utils';

export const getReportCategories = async (accessToken: string, profileId?: string) => {
  const profileIdHeader = profileId ? { 'user-profile': profileId } : null;

  const response = await client(accessToken, profileIdHeader).get<ReportCategoriesResponse>(
    `${API_EVENT_CATEGORIES}`,
  );
  return response.data;
};

export const getReportTypeSchema = async (accessToken: string, type: string) => {
  const response = await client(accessToken).get<ReportTypeSchemaResponse>(
    `${API_SCHEMA}/eventtype/${type}`,
  );
  return response.data;
};

export const getReportTypes = async (accessToken: string, profileId?: string) => {
  const profileIdHeader = profileId ? { 'user-profile': profileId } : null;
  const response = await client(accessToken, profileIdHeader).get<ReportTypesResponse>(
    `${API_EVENT_TYPES}/?include_schema=false`,
  );
  return response.data;
};

/**
 * Create a new event in the remote database.
 *
 * @param accessToken String  Access token received during the authentication.
 * @param data Any  All the information to be stored in the event.
 *  This is converted into a JSON and sent to the endpoint.
 * @param userProfileId? String  Profile remote id to link profile to report history.
 * For parent users, this param should be empty
 * @returns Object  {code: 201, message: 'Created'} when successful,
 *  throws an exception when an error occurs.
 */
export const postEvent = async (accessToken: string, data: any, userProfileId?: string) => {
  const response = await axios({
    method: 'post',
    baseURL: `${SITE.name}${SITE.domain}`,
    url: API_EVENTS,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT_VALUE,
      ...userProfileId && { 'user-profile': userProfileId },
    },
    data: JSON.stringify(data),
  });

  return response.data;
};

export const createReportNote = async (
  accessToken: string,
  eventId: string,
  note: string,
  userProfileId?: string,
) => {
  const url = getApiUrl(`${API_EVENT}/${eventId}${API_ATTACHMENT_NOTES}`);
  const headers: any = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT_VALUE,
  };

  if (userProfileId) {
    headers['user-profile'] = userProfileId;
  }

  const config = {
    headers,
  };

  const response = await axios.post(url, JSON.stringify({ text: note }), config);

  return response.data;
};

export const postPatrolSegmentEvent = async (
  accessToken: string,
  patrolSegmentId: string,
  data: any,
  userProfileId?: string,
) => {
  const url = getApiUrl(`${API_PATROLS_SEGMENTS}/${patrolSegmentId}${API_PATROLS_EVENTS}`);
  const config = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT_VALUE,
      ...userProfileId && { 'user-profile': userProfileId },
    },
  };

  const response = await axios.post(url, JSON.stringify(data), config);
  return response.data;
};

// Utility Functions
export const parseReportCategories = (
  response: Category[],
  accountId: string | undefined,
): string[][] => {
  const parsedReportCategories: string[][] = [];

  response.forEach((category) => {
    if (category.flag === 'user') {
      parsedReportCategories.push([
        category.id,
        // @ts-ignore
        accountId,
        JSON.stringify(category.profile_id),
        category.value,
        category.display,
        category.ordernum?.toString() || '1000', // The value 1000 is to mimic the default in web - https://github.com/PADAS/das-web-react/blob/f2faf8d708c82c6aec10aaea03ecd47c852ea891/src/utils/event-types.js#L66
      ]);
    }
  });

  return parsedReportCategories;
};

// eslint-disable-next-line arrow-body-style
export const getIconMarkup = (iconStaticResource: string) => {
  return fetch(iconStaticResource)
    .then((staticResourceResponse) => {
      if (staticResourceResponse.ok) {
        return staticResourceResponse.blob();
      }
      throw new Error('Invalid static resource');
    })
    .then((blob) => new Response(blob).text())
    .then((markup) => markup)
    .catch(() => null);
};

export const parseToActiveUserArray = (
  type: Type,
  userId: string | undefined,
  icon: string,
  schema: string,
): any[] => [
  type.id,
  userId,
  type.value,
  type.display,
  schema || '',
  type.category.id,
  type.geometry_type,
  type.default_priority,
  type.icon_id,
  icon,
  type.is_active,
];

export const parseToProfileArray = (
  type: Type,
  accountId: string | undefined,
  profileId: string | undefined,
  icon: string,
  schema: string,
): any[] => [
  type.id,
  accountId,
  profileId,
  type.value,
  type.display,
  schema || '',
  type.category.id,
  type.geometry_type,
  type.default_priority,
  type.icon_id,
  icon,
  type.is_active,
];

export const isReportTypeVisible = (type: Type) => !type.readonly
  && !type.is_collection && type.category.flag !== 'system';

export const getReportTypeIcon = async (iconId: string) => {
  const host = getSecuredStringForKey(SITE_VALUE_KEY) || '';
  if (isEmpty(host) || isEmpty(iconId)) {
    return undefined;
  }

  const staticResources = STATIC_RESOURCES.replace('%host%', host);

  if (isEmpty(staticResources)) {
    return undefined;
  }
  const iconStaticResource = staticResources.replace('%icon%', iconId);

  const iconMarkup = await getIconMarkup(iconStaticResource);

  return iconMarkup;
};
