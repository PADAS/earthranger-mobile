// Internal Dependencies
import { InitialState } from '../types/redux';

// Initial State
export const initialState: InitialState = {
  session: {
    accessToken: '',
    refreshToken: '',
    error: null,
    sessionError: null,
  },
  reports: {
    noteId: -1,
    textNote: '',
  },
};

// Action Types
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const GET_SESSION = 'GET_SESSION';
export const GET_SESSION_ERROR = 'GET_SESSION_ERROR';
export const CREATE_NOTE = 'CREATE_NOTE';
export const CLEAR_NOTE_DATA = 'CLEAR_NOTE_DATA';
export const CLEAR_SESSION = 'CLEAR_SESSION';
