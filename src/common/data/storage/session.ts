import { SessionResponse } from '../../model/sessionResponse';
import { localStorage } from './keyValue';
import {
  LAST_SYNC_LOCATION_TIME_KEY,
  SESSION_KEY,
  USER_ID_KEY,
} from '../../constants/constants';
import { localStorageSecured } from './utils';

export const saveSession = (session: SessionResponse) => {
  localStorageSecured.set(SESSION_KEY, JSON.stringify(session));
};

export const getSession = () => {
  const sessionInfo = localStorageSecured.getString(SESSION_KEY) || '';

  if (sessionInfo) {
    return JSON.parse(sessionInfo) as SessionResponse;
  }

  return null;
};

export const cleanSession = () => {
  localStorageSecured.delete(SESSION_KEY);
  localStorageSecured.delete(USER_ID_KEY);
  localStorage.delete(LAST_SYNC_LOCATION_TIME_KEY);
};
