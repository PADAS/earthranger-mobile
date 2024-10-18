// External Dependencies
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  ImageBackground, StatusBar, Text, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ImmersiveMode from 'react-native-immersive-mode';

// Internal Dependencies
import { usePopulateUsers } from '../../../common/data/users/usePopulateUsers';
import { usePopulateReportCategories } from '../../../common/data/reports/usePopulateReportCategories';
import { usePopulateReportTypes } from '../../../common/data/reports/usePopulateReportTypes';
import { EarthRangerIcon } from '../../../common/icons/EarthRangerIcon';
import { getSession } from '../../../common/data/storage/session';
import { getSyncStateScope, SyncScope } from '../../../api/SyncService';
import { useSyncState } from '../../../common/data/hooks/useSyncState';
import { usePopulatePatrolTypes } from '../../../common/data/patrols/usePopulatePatrolTypes';
import { useRetrieveUserProfiles } from '../../../common/data/users/useRetrieveUserProfiles';
import { logGeneral } from '../../../common/utils/logUtils';
import { RootStackParamList } from '../../../common/types/types';
import { usePopulateUserSubjects } from '../../../common/data/users/usePopulateUserSubjects';
import { getAuthState } from '../../../common/utils/authUtils';
import { AuthState, Permissions } from '../../../common/enums/enums';
import { getBoolForKey, setBoolForKey } from '../../../common/data/storage/keyValue';
import { useRetrievePatrolPermissions } from '../../../common/data/permissions/useRetrievePermissions';
import { useRetrieveBasemapThumbnails } from '../../../common/data/basemaps/useRetrieveBasemapThumbnails';
import { useDownloadSubjectGroups } from '../../../common/data/subjects/useDownloadSubjectGroups';
import { useRetrieveSubjects } from '../../../common/data/subjects/useRetrieveSubjects';
import subjectsStorage from '../../../common/data/storage/subjectsStorage';

// Constants
import { COLORS_LIGHT } from '../../../common/constants/colors';
import { ACTIVE_USER_HAS_PATROLS_PERMISSION, IS_IOS } from '../../../common/constants/constants';

// Styles
import style from './SyncLoaderView.styles';

const SyncLoaderView = () => {
  // Hooks
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SyncLoaderView'>>();
  const { populateUserProfiles, updateAuthState } = usePopulateUsers();
  const {
    populateReportCategories,
    populateReportCategoriesForProfiles,
  } = usePopulateReportCategories();
  const { populateReportTypes, populateProfileReportTypes } = usePopulateReportTypes();
  const { insertSyncState } = useSyncState();
  const { populatePatrolTypes } = usePopulatePatrolTypes();
  const { retrieveUserProfiles } = useRetrieveUserProfiles();
  const { populateUserSubjects } = usePopulateUserSubjects();
  const { isPermissionAvailable } = useRetrievePatrolPermissions();
  const { retrieveBasemapThumbnails } = useRetrieveBasemapThumbnails();
  const { downloadSubjectGroups } = useDownloadSubjectGroups();
  const { retrieveSubjects } = useRetrieveSubjects();

  // Component's State
  const [currentLoadingStepName, setCurrentLoadingStepName] = useState('');
  const [currentLoadingProgress, setCurrentLoadingProgress] = useState(0);
  const accessToken = useRef(getSession()?.access_token || '');

  // Constants
  const LOADING_STEPS = [
    {
      message: t('loginView.loadingAccountInformation'),
      progress: 20,
    },
    {
      message: t('loginView.loadingReportCategories'),
      progress: 40,
    },
    {
      message: t('loginView.loadingTypesOfReports'),
      progress: 60,
    },
    {
      message: t('loginView.loadingPatrolTypes'),
      progress: 80,
    },
    {
      message: t('loginView.loadingSubjectGroups'),
      progress: 100,
    },
  ];

  useEffect(() => {
    // Retrieve data from remote server and populate local database
    const populateData = async () => {
      setCurrentLoadingStepName(LOADING_STEPS[0].message);
      await populateUserProfiles(accessToken.current);
      await populateUserSubjects(accessToken.current);

      // Download basemap thumbnails
      await retrieveBasemapThumbnails();

      await updateAuthState();
      const isPatrolPermissionAvailable = await isPermissionAvailable(Permissions.patrol);
      setBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION, isPatrolPermissionAvailable);
      // The values retrieved are tied to the user
      setCurrentLoadingProgress(LOADING_STEPS[0].progress);
      setCurrentLoadingStepName(LOADING_STEPS[1].message);
      await populateReportCategories(accessToken.current);
      await populateReportCategoriesForProfiles(accessToken.current);
      setCurrentLoadingProgress(LOADING_STEPS[1].progress);
      setCurrentLoadingStepName(LOADING_STEPS[2].message);
      await populateReportTypes(accessToken.current);
      await populateProfileReportTypes(accessToken.current);
      setCurrentLoadingProgress(LOADING_STEPS[2].progress);
      setCurrentLoadingStepName(LOADING_STEPS[3].message);
      if (getBoolForKey(ACTIVE_USER_HAS_PATROLS_PERMISSION)) {
        await populatePatrolTypes(accessToken.current);
      }
      setCurrentLoadingProgress(LOADING_STEPS[3].progress);

      // Retrieve and populate subject groups
      setCurrentLoadingStepName(LOADING_STEPS[4].message);
      await downloadSubjectGroups(accessToken.current);
      setCurrentLoadingProgress(LOADING_STEPS[4].progress);

      // Initialize list of subjects in key/value storage
      await initSubjectsList();

      // initial state synced with remote scope
      // eslint-disable-next-line no-restricted-syntax
      for (const syncScope of Object.values(SyncScope)) {
        // eslint-disable-next-line no-await-in-loop
        const eTag = await getSyncStateScope(accessToken.current, syncScope);
        const scope = eTag.toString().replace(/["[^W/]*"+/g, '');
        // eslint-disable-next-line no-await-in-loop
        await insertSyncState(syncScope, scope, scope);
      }

      if (getAuthState() === AuthState.required) {
        const userProfiles = await retrieveUserProfiles();
        logGeneral.info(`${userProfiles.length} user profile found!`);
        navigateTo('PinAuthenticationView');
      } else {
        // single user workflow
        navigateTo('MainTabBar');
      }
    };

    populateData();
  }, [accessToken.current]);

  useFocusEffect(useCallback(() => {
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarTranslucent(true);

    return () => {
      ImmersiveMode.fullLayout(false);
      ImmersiveMode.setBarTranslucent(false);
    };
  }, []));

  const navigateTo = (name: string) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name }],
    }));
  };

  const initSubjectsList = async () => {
    const subjectsList = await retrieveSubjects();

    // @ts-ignore
    if (subjectsList.length > 0 && subjectsStorage.subjectsKey.get() === undefined) {
      // @ts-ignore
      subjectsStorage.subjectsKey.set(JSON.stringify(subjectsList.slice()));
    }
  };

  return (
    <>
      {(IS_IOS && <StatusBar translucent barStyle="light-content" />)}
      <View style={style.loadingViewBackground}>
        <ImageBackground
          /* eslint-disable-next-line global-require */
          source={require('../../../../assets/loading-bg.png')}
          resizeMode="cover"
          style={style.loadingViewImage}
        >
          <View style={[style.loadingViewItem, style.loadingViewLogo]}>
            <EarthRangerIcon />
          </View>
          <View style={[style.loadingViewItem, style.loadingViewText]}>
            <Text style={style.loadingViewStepText}>{currentLoadingStepName}</Text>
          </View>
          <View style={style.loadingViewItem}>
            <View style={style.loadingViewLoaderContainer}>
              <View style={{
                width: currentLoadingProgress,
                height: 8,
                borderRadius: 16,
                backgroundColor: COLORS_LIGHT.white,
              }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export { SyncLoaderView };
