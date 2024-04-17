/* eslint-disable no-await-in-loop */
// External Dependencies
import { useCallback } from 'react';
import { CommonActions, ParamListBase } from '@react-navigation/native';
import { isEmpty } from 'lodash-es';

// Internal Dependencies
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logGeneral } from './logUtils';
import { getSession, saveSession } from '../data/storage/session';
import { ApiStatus } from '../types/apiModels';
import { refreshToken as refreshTokenApi } from '../../api/sessionAPI';
import { getApiStatus, isExpiredTokenStatus } from './errorUtils';

let refreshingToken = false;

export const useRefreshToken = () => {
  const handleRefreshToken = useCallback(async (
    navigation: NativeStackNavigationProp<ParamListBase>,
  ) => {
    if (!refreshingToken) {
      refreshingToken = true;
      const token = getSession()?.refresh_token || '';
      if (isEmpty(token)) {
        navigateToLogin(navigation);
        refreshingToken = false;
        return false;
      }
      logGeneral.debug('useRefreshToken :: Refreshing token...');
      const status = await refreshToken(token);
      if (status === ApiStatus.Succeeded) {
        logGeneral.debug('useRefreshToken :: Token refreshed');
        refreshingToken = false;
        return true;
      }
      if (isExpiredTokenStatus(status) || status === ApiStatus.BadRequest) {
        logGeneral.debug('useRefreshToken :: Expired refresh token');
        navigateToLogin(navigation);
      }
      refreshingToken = false;
      return false;
    }
    return false;
  }, []);

  const refreshToken = async (token: string) => {
    try {
      const sessionData = await refreshTokenApi(token);
      if (sessionData) {
        saveSession(sessionData);
        return ApiStatus.Succeeded;
      }
      return ApiStatus.Unknown;
    } catch (error) {
      logGeneral.error('useRefreshToken :: Error refreshing token ', error);
      return getApiStatus(error);
    }
  };

  const navigateToLogin = (navigation: NativeStackNavigationProp<ParamListBase>) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'LoginView', params: { shouldShowTokenExpiredAlert: true } }],
    }));
  };

  return { handleRefreshToken };
};
