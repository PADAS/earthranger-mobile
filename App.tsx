/* eslint-disable import/no-named-as-default */
// External Dependencies
import React, { useEffect } from 'react';
// To make BottomSheet work, this instruction is on their site:
// Please make sure to wrap your App with GestureHandlerRootView when
// you've upgraded to React Native Gesture Handler ^2.
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

// Internal Dependencies
import LoginView from './src/views/Login/LoginView';
import { SplashScreen } from './src/views/SplashScreen/SplashScreen';
import { TrackLocationMapView } from './src/views/TrackLocationMap/TrackLocationMapView';
import ReportIssueView from './src/views/SettingsSection/ReportIssue/ReportIssueView';
import { MainTabBar } from './src/views/TabBar/MainTabBar';
import { ReportCategoriesView } from './src/views/Reports/components/ReportCategoriesView/ReportCategoriesView';
import { ReportTypesView } from './src/views/Reports/components/ReportTypesView/ReportTypesView';
import { RootStackParamList } from './src/common/types/types';
import { CloseIcon } from './src/common/icons/CloseIcon';
import { ReportsView } from './src/views/Reports/ReportsView';
import { customBackButton, osBackIcon } from './src/common/components/header/header';
import { ReportForm } from './src/views/Reports/components/ReportForm/ReportForm';
import { ReportNoteView } from './src/views/Reports/components/ReportForm/components/ReportNoteView/ReportNoteView';
import { hiddenHeaderOption, navigationOptionsHeader } from './src/common/props/headerProps';
import { ReportEditLocationView } from './src/views/Reports/components/ReportEditLocationView/ReportEditLocationView';
import { RecordReportAreaView } from './src/views/Reports/components/RecordReportAreaView/RecordReportAreaView';
import { ReportRepeatableFieldListView } from './src/views/Reports/components/ReportForm/components/ReportRepeatableFieldListView/ReportRepeatableFieldListView';
import { RepeatableFormView } from './src/views/Reports/components/ReportForm/components/ReportRepeatableFieldListView/components/RepeatableFormView/RepeatableFormView';
import { SyncLoaderView } from './src/views/Login/SyncLoaderView/SyncLoaderView';
import {
  PinAuthenticationView,
} from './src/views/Login/PinAuthenticationView/PinAuthenticationView';
import { SubjectsView } from './src/views/SettingsSection/SubjectsView/SubjectsView';
import { BasemapView } from './src/views/SettingsSection/BasemapView/BasemapView';
import { CoordinateUnitsView } from './src/views/SettingsSection/CoordinateUnitsView/CoordinateUnitsView';
import { PatrolsTypeView } from './src/views/TrackLocationMap/components/PatrolsTypeView/PatrolsTypeView';
import { StartPatrolView } from './src/views/TrackLocationMap/components/StartPatrolView/StartPatrolView';
import { PhotoQualityView } from './src/views/SettingsSection/PhotoQualityView/PhotoQualityView';
import { cropHeaderTitleText } from './src/common/utils/stringUtils';
import { ResetDatabaseCacheView } from './src/views/SettingsSection/ResetDatabaseCacheView/ResetDatabaseCacheView';
import { EventsListFilterView } from './src/views/Reports/components/EventsListFilterView/EventsListFilterView';

LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
  // Hooks
  const { t } = useTranslation();

  // Component's Life-cycle
  useEffect(() => {
    i18next.changeLanguage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, flexGrow: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={hiddenHeaderOption}
            />
            <Stack.Screen
              name="LoginView"
              component={LoginView}
              options={hiddenHeaderOption}
            />
            <Stack.Screen
              name="SyncLoaderView"
              component={SyncLoaderView}
              options={hiddenHeaderOption}
            />
            <Stack.Screen
              name="PinAuthenticationView"
              component={PinAuthenticationView}
              options={hiddenHeaderOption}
            />
            <Stack.Screen
              name="TrackLocationMapView"
              component={TrackLocationMapView}
              options={hiddenHeaderOption}
            />
            <Stack.Screen
              name="MainTabBar"
              component={MainTabBar}
              options={hiddenHeaderOption}
            />
            <Stack.Screen
              name="ReportsView"
              component={ReportsView}
              options={() => ({
                ...navigationOptionsHeader,
                title: t('reports.title'),
              })}
            />
            <Stack.Screen
              name="ReportIssueView"
              component={ReportIssueView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('reportIssue.appBarTitle'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop()),
              })}
            />
            <Stack.Screen
              name="ReportCategoriesView"
              component={ReportCategoriesView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('reports.appBarTitle'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="ReportTypesView"
              component={ReportTypesView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: '',
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop()),
              })}
            />
            <Stack.Screen
              name="ReportForm"
              component={ReportForm}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: '',
                headerLeft: () => customBackButton(osBackIcon, () => navigation.popToTop()),
              })}
            />
            <Stack.Screen
              name="ReportNoteView"
              component={ReportNoteView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('reportNotes.appBarTitle'),
                headerLeft: () => customBackButton(<CloseIcon />, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="ReportEditLocationView"
              component={ReportEditLocationView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('reportEditLocationView.appBarTitle'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop()),
              })}
            />
            <Stack.Screen
              name="RecordReportAreaView"
              component={RecordReportAreaView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: cropHeaderTitleText(t('recordReportArea.appBarTitle')),
                headerLeft: () => customBackButton(<CloseIcon />, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="ReportRepeatableFieldListView"
              component={ReportRepeatableFieldListView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: '',
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="RepeatableFormView"
              component={RepeatableFormView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: '',
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="EventsListFilterView"
              component={EventsListFilterView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('eventsListFilterView.appBarTitle'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="SubjectsView"
              component={SubjectsView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: '',
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="BasemapView"
              component={BasemapView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('settingsView.basemap'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="CoordinateUnitsView"
              component={CoordinateUnitsView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('settingsView.coordinatesUnits'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="PatrolsTypeView"
              component={PatrolsTypeView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('mapTrackLocation.patrolTypes'),
                headerLeft: () => customBackButton(<CloseIcon />, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="StartPatrolView"
              component={StartPatrolView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: '',
                headerLeft: () => customBackButton(
                  <CloseIcon />,
                  () => navigation.popToTop(),
                  true,
                ),
              })}
            />
            <Stack.Screen
              name="PhotoQualityView"
              component={PhotoQualityView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('settingsView.photoQuality'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
            <Stack.Screen
              name="ResetDatabaseCacheView"
              component={ResetDatabaseCacheView}
              options={({ navigation }) => ({
                ...navigationOptionsHeader,
                title: t('aboutView.resetDatabaseCache'),
                headerLeft: () => customBackButton(osBackIcon, () => navigation.pop(), true),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
