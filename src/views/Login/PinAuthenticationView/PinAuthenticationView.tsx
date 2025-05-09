// External Dependencies
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonActions, useNavigation } from '@react-navigation/native';
// @ts-ignore
import { PinScreen } from 'react-native-awesome-pin';

// Internal Dependencies
import { icons } from '../../../ui/AssetsUtils';
import { encode } from '../../../common/utils/base64Utils';
import { useRetrieveUser } from '../../../common/data/users/useRetrieveUser';
import {
  ACTIVE_USER_HAS_PATROLS_PERMISSION,
  ACTIVE_USER_NAME_KEY,
  CUSTOM_CENTER_COORDS_ENABLED,
  CUSTOM_CENTER_COORDS_LAT,
  CUSTOM_CENTER_COORDS_LON,
  PATROL_INFO_ENABLED,
  PATROL_INFO_EVENT_TYPE_VALUE,
  REPORTS_SUBMITTED_KEY,
  SUBJECT_ID_KEY,
  TRACKED_BY_SUBJECT_STATUS_KEY,
  USER_REMOTE_ID_KEY,
  USER_SUBJECT_NAME_KEY,
} from '../../../common/constants/constants';
import { getSecuredStringForKey, setSecuredStringForKey } from '../../../common/data/storage/utils';
import { logGeneral } from '../../../common/utils/logUtils';
import { setAuthState } from '../../../common/utils/authUtils';
import { AuthState, Permissions } from '../../../common/enums/enums';
import { usePopulateUsers } from '../../../common/data/users/usePopulateUsers';
import { setBoolForKey, setNumberForKey, setStringForKey } from '../../../common/data/storage/keyValue';
import { useRetrievePatrolPermissions } from '../../../common/data/permissions/useRetrievePermissions';
import { resetUserEventFilters } from '../../../common/utils/deleteSession';

// Styles
import styles from './PinAuthenticationView.styles';

const PinAuthenticationView = () => {
  // Hooks
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { retrieveUserByPin } = useRetrieveUser();
  const { updateAuthState } = usePopulateUsers();
  const { isPermissionAvailable } = useRetrievePatrolPermissions();

  // Component's State
  const pinScreen = useRef<PinScreen>(null);
  const pinCandidate = useRef(false);

  const onKeyDown = async (key: string) => {
    if (pinCandidate.current) {
      return;
    }
    if (key.length < 4) {
      pinScreen.current?.clearError();
    } else if (key.length === 4) {
      pinCandidate.current = true;
      const user = await retrieveUserByPin(encode(key));
      if (user) {
        if (getSecuredStringForKey(ACTIVE_USER_NAME_KEY) !== user.username) {
          resetUserEventFilters();
          setNumberForKey(REPORTS_SUBMITTED_KEY, 0);
          setBoolForKey(PATROL_INFO_ENABLED, false);
          setBoolForKey(CUSTOM_CENTER_COORDS_ENABLED, false);
          setBoolForKey(TRACKED_BY_SUBJECT_STATUS_KEY, false);
          setStringForKey(CUSTOM_CENTER_COORDS_LAT, '');
          setStringForKey(CUSTOM_CENTER_COORDS_LON, '');
        }
        setSecuredStringForKey(ACTIVE_USER_NAME_KEY, user.username);
        setSecuredStringForKey(USER_REMOTE_ID_KEY, user.remote_id);
        setSecuredStringForKey(USER_SUBJECT_NAME_KEY, user.username);
        setSecuredStringForKey(SUBJECT_ID_KEY, user.subject_id);
        setStringForKey(PATROL_INFO_EVENT_TYPE_VALUE, '');

        const isPatrolPermissionAvailable = await isPermissionAvailable(Permissions.patrol);
        setBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION, isPatrolPermissionAvailable);

        logGeneral.info(`Active User: ${user.username}`);

        // updateAuthState cannot update userInvalidated state
        setAuthState(AuthState.authenticated);
        // Auth is reevaluated in case the active user was a removed profile
        await updateAuthState();

        navigateToMainTabBar();
      } else {
        pinScreen.current?.throwError(t('pinAuthentication.incorrectPin'));
        setAuthState(AuthState.required);
        pinScreen.current.setState({ pin: '' });
      }
      pinCandidate.current = false;
    }
  };

  const navigateToMainTabBar = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'MainTabBar' }],
    }));
  };

  return (
    <PinScreen
      /* eslint-disable-next-line no-return-assign */ // @ts-ignore
      onRef={(ref: any) => (pinScreen.current = ref)}
      tagline={t('pinAuthentication.enterPin')}
      numberOfPins={4}
      keyVibration={false}
      shakeVibration={false}
      logoEnabled
      headerBackgroundColor="white"
      containerStyle={styles.container}
      logo={icons.LoginView.loginLogo}
      logoStyle={styles.logo}
      taglineStyle={styles.tagLine}
      pinStyle={styles.pin}
      pinActiveStyle={styles.pinActive}
      errorStyle={styles.error}
      errorTextStyle={styles.errorText}
      keyDown={onKeyDown}
    />
  );
};

export { PinAuthenticationView };
