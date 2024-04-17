// Internal Dependencies
import { defaultTo } from 'lodash-es';
import { AuthState } from '../enums/enums';
import { getStringForKey, setStringForKey } from '../data/storage/keyValue';
import { AUTH_STATE, PARENT_USER_REMOTE_ID_KEY, USER_REMOTE_ID_KEY } from '../constants/constants';
import { getSecuredStringForKey } from '../data/storage/utils';

// eslint-disable-next-line max-len
export const getAuthState = () => defaultTo(getStringForKey(AUTH_STATE), AuthState.unknown) as AuthState;
export const setAuthState = (state: AuthState) => {
  setStringForKey(AUTH_STATE, state);
};

export const isParentUserActive = () => {
  const parentUserRemoteId = getSecuredStringForKey(PARENT_USER_REMOTE_ID_KEY || '');
  const activeUserRemoteId = getSecuredStringForKey(USER_REMOTE_ID_KEY || '');
  return parentUserRemoteId === activeUserRemoteId;
};
