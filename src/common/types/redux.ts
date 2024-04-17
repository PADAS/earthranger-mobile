export interface InitialState {
  session: {
    accessToken: string,
    refreshToken: string,
    error: null,
    sessionError: null,
  },
  reports: {
    noteId: number,
    textNote: string,
  }
}

export type ActionType = 'REFRESH_TOKEN'
| 'REFRESH_TOKEN_ERROR'
| 'USER_LOGIN'
| 'USER_LOGIN_ERROR'
| 'GET_SESSION'
| 'GET_SESSION_ERROR'
| 'CREATE_NOTE'
| 'CLEAR_NOTE_DATA'
| 'NUMBER_OF_REPORT_DRAFTS'
| 'CLEAR_SESSION';

export interface ReducerAction {
  type: ActionType,
  payload: any;
}
