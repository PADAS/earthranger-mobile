// External Dependencies
import axios from 'axios';
import dayjs from 'dayjs';

// Internal Dependencies
import {
  UserProfilesResponse,
  UserResponse,
} from '../common/types/usersResponse';
import { getDeviceUuid } from '../common/utils/deviceUuid';
import {
  API_PROFILES,
  API_TRACK_OBSERVATIONS,
  API_USER,
  API_USER_ME,
  client,
  getApiUrl,
} from './EarthRangerService';

export const getRemoteUser = async (accessToken: string, profileId?: string) => {
  const extraHeader = profileId ? { 'user-profile': profileId } : {};
  const response = await client(accessToken, extraHeader).get<UserResponse>(
    `${API_USER_ME}`,
  );
  return response.data;
};

export const getRemoteUserByID = async (
  accessToken: string,
  userID: string,
  profileId?: string,
) => {
  const extraHeader = profileId ? { 'user-profile': profileId } : {};
  const response = await client(accessToken, extraHeader).get<UserResponse>(`${API_USER}/${userID}`);
  return response.data;
};

export const createSubjectForUsername = async (
  accessToken: string,
  userId: string,
) => {
  const url = getApiUrl(API_TRACK_OBSERVATIONS);
  const config = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  const data = {
    recorded_at: dayjs().format(),
    subject_subtype_id: 'ranger',
    user_id: `${userId}`,
    manufacturer_id: `${getDeviceUuid()}`,
    message_key: 'create-source-subject',
    source_type: 'tracking_device',
    location: {
      lat: 0,
      lon: 0,
    },
  };

  return axios.post(url, JSON.stringify(data), config);
};

export const getUserProfiles = async (
  accessToken: string,
  userId: string,
) => {
  const response = await client(accessToken).get<UserProfilesResponse>(
    `${API_USER}/${userId}${API_PROFILES}`,
  );

  return response.data;
};
