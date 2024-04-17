// External Dependencies
import crashlytics from '@react-native-firebase/crashlytics';
import { Dispatch } from 'redux';

// Internal Dependencies
import {
  USER_LOGIN_ERROR,
  USER_LOGIN,
  CLEAR_SESSION,
} from '../../constants/redux';
import { userLogin } from '../../../api/sessionAPI';
import { saveSession } from '../../data/storage/session';
import { SITE_VALUE_KEY, USER_NAME_KEY } from '../../constants/constants';
import { getSecuredStringForKey, setSecuredStringForKey } from '../../data/storage/utils';
import { SessionResponse } from '../../model/sessionResponse';
import log from '../../utils/logUtils';

const userLoginAction = (sessionResponse: SessionResponse) => ({
  type: USER_LOGIN,
  payload: { sessionResponse },
});

const userLoginErrorAction = (error: any) => ({
  type: USER_LOGIN_ERROR,
  payload: { error },
});

export const loginAction = (
  usernameValue: string,
  passwordValue: string,
) => async (dispatch: Dispatch) => {
  try {
    const sessionData = await userLogin(usernameValue, passwordValue);
    // Update local storage
    saveSession(sessionData);

    // Update Crashlytics
    crashlytics().log('User signed in.');
    await crashlytics().setAttribute('username', String(usernameValue));

    // Update Redux store
    dispatch(userLoginAction(sessionData));

    // Log EarthRanger info
    log.info(`Site: ${getSecuredStringForKey(SITE_VALUE_KEY)}`);
    log.info(`Logged in User: ${usernameValue}`);

    setSecuredStringForKey(USER_NAME_KEY, usernameValue);
  } catch (error) {
    dispatch(userLoginErrorAction(error));
  }
};

export const clearSessionAction = () => (dispatch: Dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
