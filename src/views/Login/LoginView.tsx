/* eslint-disable global-require */
// External Dependencies
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { enablePromise } from 'react-native-sqlite-storage';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import { isEmpty } from 'lodash-es';
import { CommonActions } from '@react-navigation/native';
import { ThunkDispatch } from 'redux-thunk/es/types';
import { Action } from 'redux';

// Internal Dependencies
import {
  ACTIVE_USER_NAME_KEY,
  ALERT_BUTTON_BACKGROUND_COLOR_BLUE,
  BASEMAP_KEY,
  EXPERIMENTAL_FEATURES_FLAG_KEY,
  IS_IOS,
  PARENT_USER_REMOTE_ID_KEY,
  SAVE_TO_CAMERA_ROLL,
  SCREEN_FIT_700_TO_600,
  SCREEN_FIT_LESS_THAN_600,
  TRACKED_BY_SUBJECT_STATUS_KEY,
  USER_NAME_KEY,
  USER_SUBJECT_NAME_KEY,
} from '../../common/constants/constants';
import { LOGIN_SCREEN } from '../../analytics/model/constantsScreens';
import { loginAction } from '../../common/state/actions/sessionActions';
import { setBoolForKey } from '../../common/data/storage/keyValue';
import { icons } from '../../ui/AssetsUtils';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../analytics/model/analyticsEvent';
import { logEvent, logScreenView } from '../../analytics/wrapper/analyticsWrapper';
import { createLoginSuccessEvent } from '../../analytics/login/loginAnalytics';
import { screenViewEventToHashMap } from '../../analytics/model/analyticsScreenView';
import createScreenViewEvent from '../screenViewTracker/screenViewTracker';
import { LoginForm } from './components/LoginForm/LoginForm';
import { InitialState } from '../../common/types/redux';
import { getSession } from '../../common/data/storage/session';
import {
  getUserRemoteId, setUserId, useInitDatabase, useRemoveDB,
} from '../../common/data/PersistentStore';
import { getSecuredStringForKey, setSecuredStringForKey } from '../../common/data/storage/utils';
import { getRemoteUser } from '../../api/usersAPI';
import { CustomAlert } from '../../common/components/CustomAlert/CustomAlert';
import { LogOutAlertIcon } from '../../common/icons/LogOutAlertIcon';
import { usePopulateUsers } from '../../common/data/users/usePopulateUsers';
import { ApiStatus } from '../../common/types/apiModels';
import { logGeneral } from '../../common/utils/logUtils';
import { Loader } from '../../common/components/Loader/Loader';
import { getAuthState, setAuthState } from '../../common/utils/authUtils';
import { AuthState } from '../../common/enums/enums';
import { removeDBLocations } from '../../common/utils/locationUtils';
import { deleteSession } from '../../common/utils/deleteSession';

// Styles
import style from './LoginView.styles';

enablePromise(true);

// Constants
const MAX_VIEW_OFFSET = -70;
const MAIN_TAB_BAR = 'MainTabBar';
const SYNC_LOADER_VIEW = 'SyncLoaderView';
const PIN_AUTH_VIEW = 'PinAuthenticationView';

/**
 * Login View.
 *
 * @param Redux Props
 * @returns JSX
 */
const LoginView = ({
  navigation,
  route,
  accessToken,
  loginError,
  login,
}: any) => {
  // Hooks
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const { removeDB } = useRemoveDB();
  const { initDatabase } = useInitDatabase();
  const { populateUsers, isPinWorkflowAvailable } = usePopulateUsers();

  // Component's State
  const { shouldShowTokenExpiredAlert } = route.params || { shouldShowTokenExpiredAlert: false };
  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);
  const [internetErrorMessage, setInternetErrorMessage] = useState('');
  const [fieldErrorOffset] = useState(0);
  const [connectionErrorOffset, setConnectionErrorOffset] = useState(0);
  const [tokenExpiredAlertVisible, setTokenExpiredAlertVisible] = useState(shouldShowTokenExpiredAlert || '');
  const [userAccountErrorMessage, setUserAccountErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Utility Functions
  const trackAnalyticsEvent = useCallback(async (event: AnalyticsEvent) => {
    await logEvent(event.eventName, analyticsEventToHashMap(event));
  }, []);

  const trackScreenView = useCallback(async () => {
    await logScreenView(screenViewEventToHashMap(createScreenViewEvent(
      LOGIN_SCREEN,
      LOGIN_SCREEN,
    )));
  }, []);

  const updateKeyboardOffset = () => {
    let adjustment = 0;
    if (height <= 700 && height >= 600) adjustment = -height * (SCREEN_FIT_700_TO_600);
    else if (height < 600) adjustment = -height * (SCREEN_FIT_LESS_THAN_600);
    setKeyboardVerticalOffset(fieldErrorOffset + connectionErrorOffset + adjustment);
  };

  const navigateTo = (view: string) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: view }],
    }));
  };

  // Component's Life-cycle
  useEffect(() => {
    trackScreenView();

    /* istanbul ignore next */
    NetInfo.addEventListener(async (state) => {
      if (state.isInternetReachable !== null) {
        setInternetErrorMessage(state.isInternetReachable ? '' : t('loginView.internetConnectionNeeded'));
      }
      if (isEmpty(internetErrorMessage)) {
        setConnectionErrorOffset(0);
      } else {
        setConnectionErrorOffset(MAX_VIEW_OFFSET);
      }

      updateKeyboardOffset();
    });
  }, []);

  useEffect(() => {
    const sessionDataFromSecureStorage = getSession();

    const setUserOrPopulateDB = async () => {
      // db up to date, set login user
      const userName = getSecuredStringForKey(USER_NAME_KEY);
      const user = await getRemoteUser(accessToken);

      if (userName) {
        setSecuredStringForKey(PARENT_USER_REMOTE_ID_KEY, user.data.id);
        const userRemoteId = await getUserRemoteId(userName);
        if (userRemoteId !== -1 && user && userRemoteId === user.data.id) {
          await setUserId(userName);
          const pinWorkflowAvailable = await isPinWorkflowAvailable();
          setAuthState(pinWorkflowAvailable ? AuthState.required : AuthState.notRequired);
          if (getAuthState() === AuthState.required) {
            setIsLoading(false);
            navigateTo(PIN_AUTH_VIEW);
            return;
          }
          setSecuredStringForKey(USER_NAME_KEY, userName);
          setSecuredStringForKey(ACTIVE_USER_NAME_KEY, userName);
          setSecuredStringForKey(USER_SUBJECT_NAME_KEY, userName);
          setIsLoading(false);
          navigateTo(MAIN_TAB_BAR);
        } else {
          setBoolForKey(EXPERIMENTAL_FEATURES_FLAG_KEY, false);
          setBoolForKey(TRACKED_BY_SUBJECT_STATUS_KEY, false);
          setBoolForKey(BASEMAP_KEY, false);
          setAuthState(AuthState.unknown);
          await removeDBLocations();
          await removeDB();
          await initDatabase();
          setSecuredStringForKey(USER_NAME_KEY, userName);
          setSecuredStringForKey(ACTIVE_USER_NAME_KEY, userName);
          setSecuredStringForKey(USER_SUBJECT_NAME_KEY, userName);
          setBoolForKey(SAVE_TO_CAMERA_ROLL, false);

          logGeneral.info(`Active User: ${userName}`);
          let apiStatus = ApiStatus.Unknown;
          try {
            apiStatus = await populateUsers(accessToken);
            if (apiStatus === ApiStatus.Succeeded) {
              setIsLoading(false);
              navigateTo(SYNC_LOADER_VIEW);
            } else {
              await deleteSession();
              setIsLoading(false);
              setUserAccountErrorMessage(t('loginView.userIssuesMessage'));
              return;
            }
          } catch (error) {
            logGeneral.error('[LoginView] Error while populating users', error);
            await deleteSession();
            setIsLoading(false);
            setUserAccountErrorMessage(t('loginView.userIssuesMessage'));
            return;
          }
        }
      }
      setIsLoading(false);
    };

    if (accessToken && sessionDataFromSecureStorage?.access_token) {
      trackAnalyticsEvent(createLoginSuccessEvent());
      setUserOrPopulateDB();
    }
  }, [accessToken]);

  useEffect(() => {
    if (loginError) {
      setIsLoading(false);
    }
  }, [loginError]);

  useEffect(() => {
    updateKeyboardOffset();
  }, [fieldErrorOffset, connectionErrorOffset]);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={IS_IOS ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <SafeAreaView style={style.containerSafeArea}>
            {/* Main Container */}
            <View style={style.container}>
              {/* Earth Ranger Logo */}
              <Image style={style.logo} source={icons.LoginView.loginLogo} />

              {/* Login Form */}
              <LoginForm
                loginError={loginError}
                internetErrorMessage={internetErrorMessage}
                trackAnalyticsEvent={trackAnalyticsEvent}
                login={login}
                userAccountErrorMessage={userAccountErrorMessage}
                onSubmit={() => setIsLoading(true)}
              />
            </View>
            {/* End Main Container */}
            <CustomAlert
              alertIcon={<LogOutAlertIcon />}
              displayAlert={tokenExpiredAlertVisible}
              alertTitleText={t('loginView.expiredTokenAlertDialog.title')}
              alertMessageText={t('loginView.expiredTokenAlertDialog.message')}
              positiveButtonText={t('loginView.expiredTokenAlertDialog.action')}
              onPositiveButtonPress={() => {
                setTokenExpiredAlertVisible(false);
              }}
              positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <Loader isVisible={isLoading} />
    </>
  );
};

const mapStateToProps = (state: InitialState) => ({
  accessToken: state.session.accessToken,
  loginError: state.session.error,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<InitialState, void, Action>) => ({
  login: (
    usernameValue: string,
    passwordValue: string,
  ) => dispatch(loginAction(usernameValue, passwordValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
