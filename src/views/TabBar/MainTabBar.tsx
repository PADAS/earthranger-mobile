// External Dependencies
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EventListenerCallback } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { TrackLocationMapView } from '../TrackLocationMap/TrackLocationMapView';
import { screenOptions, tabBarItemStyle, tabBarLabelStyle } from './style';
import { logEvent, logScreenView } from '../../analytics/wrapper/analyticsWrapper';
import createScreenViewEvent from '../screenViewTracker/screenViewTracker';
import { screenViewEventToHashMap } from '../../analytics/model/analyticsScreenView';
import AnalyticsEvent, { analyticsEventToHashMap } from '../../analytics/model/analyticsEvent';
import { createMapTabSelectedEvent, createMenuTabSelectedEvent } from '../../analytics/status/navigationAnalytics';
import { ReportsView } from '../Reports/ReportsView';
import { SettingsView } from '../SettingsSection/SettingsView/SettingsView';
import { headerBigText } from '../../common/props/headerProps';
import { SettingsIcon } from '../../common/icons/SettingsIcon';
import { LocationIcon } from '../../common/icons/LocationIcon';
import { ReportsIcon } from '../../common/icons/ReportsIcon';
import { StatusView } from '../StatusView/StatusView';
import { StatusIcon } from '../../common/icons/StatusIcon';
import { syncPendingObservations } from '../../common/utils/trackingUtils';
import { LocationIconHollow } from '../../common/icons/LocationIconHollow';
import { StatusIconHollow } from '../../common/icons/StatusIconHollow';
import { ReportsIconHollow } from '../../common/icons/ReportsIconHollow';
import { SettingsIconHollow } from '../../common/icons/SettingsIconHollow';
import { SubjectsIcon } from '../../common/icons/SubjectsIcon';
import { SubjectsIconHollow } from '../../common/icons/SubjectsIconHollow';
import { SubjectsListView } from '../SubjectsView/SubjectsListView';

const Tab = createBottomTabNavigator();

const MainTabBar = () => {
  const { t } = useTranslation();

  const locationIcon = (color: string, focused: boolean) => {
    if (focused) {
      return <LocationIcon color={color} />;
    }
    return <LocationIconHollow color={color} />;
  };

  const statusIcon = (color: string, focused: boolean) => {
    if (focused) {
      return <StatusIcon color={color} />;
    }
    return <StatusIconHollow color={color} />;
  };

  const menuIcon = (color: string, focused: boolean) => {
    if (focused) {
      return <SettingsIcon color={color} />;
    }
    return <SettingsIconHollow color={color} />;
  };

  const reportsIcon = (color: string, focused: boolean) => {
    if (focused) {
      return <ReportsIcon color={color} />;
    }
    return <ReportsIconHollow color={color} />;
  };

  const subjectsIcon = (color: string, focused: boolean) => {
    if (focused) {
      return <SubjectsIcon color={color} />;
    }
    return <SubjectsIconHollow color={color} />;
  };

  const trackScreenView = async (routeName: string) => {
    logScreenView(screenViewEventToHashMap(createScreenViewEvent(routeName, routeName)));
  };

  const trackAnalyticsEvent = (event: AnalyticsEvent) => {
    logEvent(event.eventName, analyticsEventToHashMap(event));
  };

  const trackTabSelection = (tabName: string) => {
    if (tabName === 'Map') {
      trackAnalyticsEvent(createMenuTabSelectedEvent());
    } else {
      trackAnalyticsEvent(createMapTabSelectedEvent());
    }
  };

  const tabNavigationListeners = () => ({
  // @ts-ignore
    state: (event: EventListenerCallback) => {
      const routeName = event.data.state.routeNames[event.data.state.index];
      trackScreenView(routeName);
      trackTabSelection(routeName);
      if (routeName === 'status') syncPendingObservations();
    },
  });

  return (
    <Tab.Navigator
      initialRouteName={t('mainTabBar.map')}
      screenOptions={screenOptions}
      screenListeners={tabNavigationListeners}
    >
      <Tab.Screen
        name={t('mainTabBar.map')}
        component={TrackLocationMapView}
        options={{
          tabBarIcon: ({ color, focused }) => locationIcon(color, focused),
          tabBarAccessibilityLabel: 'Map Button Bar',
          tabBarItemStyle: { ...tabBarItemStyle },
          tabBarLabelStyle,
        }}
      />
      <Tab.Screen
        name="status"
        options={{
          title: t('mainTabBar.status'),
          ...headerBigText(),
          tabBarIcon: ({ color, focused }) => statusIcon(color, focused),
          headerShown: true,
          headerTitleAlign: 'left',
          tabBarAccessibilityLabel: 'Status Button Bar',
          tabBarItemStyle: { ...tabBarItemStyle },
          tabBarLabelStyle,
        }}
        component={StatusView}
      />
      <Tab.Screen
        name={t('mainTabBar.events')}
        component={ReportsView}
        options={{
          ...headerBigText(),
          tabBarIcon: ({ color, focused }) => reportsIcon(color, focused),
          headerShown: true,
          headerTitleAlign: 'left',
          tabBarAccessibilityLabel: 'Events Button Bar',
          tabBarItemStyle: { ...tabBarItemStyle },
          tabBarLabelStyle,
        }}
      />
      <Tab.Screen
        name={t('mainTabBar.subjects')}
        component={SubjectsListView}
        options={{
          ...headerBigText(),
          tabBarIcon: ({ color, focused }) => subjectsIcon(color, focused),
          headerShown: true,
          headerTitleAlign: 'left',
          tabBarAccessibilityLabel: 'Subjects Button Bar',
          tabBarItemStyle: { ...tabBarItemStyle },
          tabBarLabelStyle,
        }}
      />
      <Tab.Screen
        name={t('mainTabBar.settings')}
        component={SettingsView}
        options={{
          ...headerBigText(),
          headerShown: true,
          headerTitleAlign: 'left',
          tabBarIcon: ({ color, focused }) => menuIcon(color, focused),
          tabBarAccessibilityLabel: 'Settings Button Bar',
          tabBarItemStyle: { ...tabBarItemStyle },
          tabBarLabelStyle,
        }}
      />
    </Tab.Navigator>
  );
};

export { MainTabBar };
