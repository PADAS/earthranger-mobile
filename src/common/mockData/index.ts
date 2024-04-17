export const LOGIN_DATA = {
  siteName: '*',
  userName: '*',
  password: '*',
  rememberMe: true,
  loginEndPoint: 'https://develop.pamdas.org/oauth2/token/',
};

export const STORE_INITIAL_STATE = {
  session: {
    accessToken: '*',
    error: '',
  },
  reports: {
    reportDraftsCount: 0,
  },
};
