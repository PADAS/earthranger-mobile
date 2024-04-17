// Internal Dependencies
import { SessionResponse } from '../../model/sessionResponse';
import {
  GET_SESSION,
  GET_SESSION_ERROR,
  USER_LOGIN,
  USER_LOGIN_ERROR,
  CLEAR_SESSION,
  initialState,
} from '../../constants/redux';
import { ReducerAction } from '../../types/redux';

// Interfaces + Types
type SessionResponsePayload = {
  payload: {
    sessionResponse: SessionResponse;
  };
};

type ErrorPayload = {
  payload: {
    error: any;
  };
};

type SessionErrorPayload = {
  payload: {
    sessionError: any;
  };
};

export const sessionReducer = (
  session = initialState.session,
  action: ReducerAction = {} as ReducerAction,
) => {
  const { type } = action;

  switch (type) {
    case USER_LOGIN: {
      const { payload }: SessionResponsePayload = action;

      return {
        ...session,
        accessToken: payload.sessionResponse.access_token,
        refreshToken: payload.sessionResponse.refresh_token,
        error: '',
      };
    }
    case USER_LOGIN_ERROR: {
      const { payload }: ErrorPayload = action;

      return {
        ...session,
        accessToken: '',
        refreshToken: '',
        error: payload.error,
      };
    }

    case GET_SESSION: {
      const { payload }: SessionResponsePayload = action;

      return {
        ...session,
        accessToken: payload.sessionResponse.access_token,
        refreshToken: payload.sessionResponse.refresh_token,
      };
    }
    case GET_SESSION_ERROR: {
      const { payload }: SessionErrorPayload = action;

      return {
        ...session,
        accessToken: '',
        refreshToken: '',
        sessionError: payload.sessionError,
      };
    }
    case CLEAR_SESSION: {
      return {
        ...initialState.session,
      };
    }
    default:
      return session;
  }
};
