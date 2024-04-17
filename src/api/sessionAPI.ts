import { SessionResponse } from '../common/model/sessionResponse';
import { OAUTH_TOKEN, sessionClient } from './EarthRangerService';

export const refreshToken = async (token: string) => {
  const formData = new FormData();
  formData.append('refresh_token', token);
  formData.append('client_id', 'er_mobile_tracker');
  formData.append('grant_type', 'refresh_token');

  const response = await sessionClient().post<SessionResponse>(`${OAUTH_TOKEN}`, formData);

  return response.data;
};

export const userLogin = async (
  usernameValue: string,
  passwordValue: string,
) => {
  const formData = new FormData();
  formData.append('username', usernameValue);
  formData.append('password', passwordValue);
  formData.append('client_id', 'er_mobile_tracker');
  formData.append('grant_type', 'password');

  const response = await sessionClient().post<SessionResponse>(`${OAUTH_TOKEN}`, formData);

  return response.data;
};
