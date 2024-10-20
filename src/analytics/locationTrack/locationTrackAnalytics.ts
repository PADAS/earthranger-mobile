import AnalyticsEvent from '../model/analyticsEvent';
import { SITE_VALUE_KEY } from '../../common/constants/constants';
import {
  TAP_STOP_TRACKING,
  TAP_START_TRACKING,
  TAP_TRACKING_OFF,
  TAP_TRACKING_ON,
} from '../model/constantsAction';
import {
  LOCATION_PERMISSION_ALLOWED,
  LOCATION_PERMISSION_DENIED,
  START_TRACKING_LOCATION,
  STOP_TRACKING_LOCATION,
} from '../model/constantsEvents';
import { MAP_SCREEN } from '../model/constantsScreens';
import { LOCATION_PERMISSION_CATEGORY, LOCATION_TRACKING_CATEGORY } from '../model/constantsCategories';
import { getSecuredStringForKey } from '../../common/data/storage/utils';

export const createStartTrackingLocationEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: START_TRACKING_LOCATION,
  screenName: MAP_SCREEN,
  category: LOCATION_TRACKING_CATEGORY,
  action: TAP_START_TRACKING,
} as AnalyticsEvent);

export const createStopTrackingLocationEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: STOP_TRACKING_LOCATION,
  screenName: MAP_SCREEN,
  category: LOCATION_TRACKING_CATEGORY,
  action: TAP_STOP_TRACKING,
} as AnalyticsEvent);

export const createLocationPermissionAllowedEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: LOCATION_PERMISSION_ALLOWED,
  screenName: MAP_SCREEN,
  category: LOCATION_PERMISSION_CATEGORY,
  action: TAP_TRACKING_ON,
} as AnalyticsEvent);

export const createLocationPermissionDeniedEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: LOCATION_PERMISSION_DENIED,
  screenName: MAP_SCREEN,
  category: LOCATION_PERMISSION_CATEGORY,
  action: TAP_TRACKING_OFF,
} as AnalyticsEvent);
