import { SITE_VALUE_KEY } from '../../common/constants/constants';
import { getSecuredStringForKey } from '../../common/data/storage/utils';
import AnalyticsEvent from '../model/analyticsEvent';
import {
  LOG_OUT,
  LOG_OUT_PENDING_SYNC,
  TAP_LOGOUT,
  TAP_REPORT_ISSUE,
  TAP_SEND_ISSUE,
  TAP_SWITCH_ACTIVE_USER,
} from '../model/constantsAction';
import {
  CONFIRM_LOGOUT_DIALOG,
  CONFIRM_LOGOUT_PENDING_SYNC_DIALOG,
  LOGOUT_SELECTED,
  REPORT_ISSUE_SELECTED,
  REPORT_ISSUE_SENT,
  SWITCH_ACTIVE_USER,
} from '../model/constantsEvents';
import { SETTINGS_SCREEN } from '../model/constantsScreens';
import { ACCOUNTS_CATEGORY, MENU_CATEGORY } from '../model/constantsCategories';

export const createLogoutSelectedEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: LOGOUT_SELECTED,
  screenName: SETTINGS_SCREEN,
  category: MENU_CATEGORY,
  action: TAP_LOGOUT,
} as AnalyticsEvent);

export const createConfirmLogoutEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: CONFIRM_LOGOUT_DIALOG,
  screenName: SETTINGS_SCREEN,
  category: MENU_CATEGORY,
  action: LOG_OUT,
} as AnalyticsEvent);

export const createConfirmLogoutPendingSyncEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: CONFIRM_LOGOUT_PENDING_SYNC_DIALOG,
  screenName: SETTINGS_SCREEN,
  category: MENU_CATEGORY,
  action: LOG_OUT_PENDING_SYNC,
} as AnalyticsEvent);

export const createReportIssueSelectedEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: REPORT_ISSUE_SELECTED,
  screenName: SETTINGS_SCREEN,
  category: MENU_CATEGORY,
  action: TAP_REPORT_ISSUE,
} as AnalyticsEvent);

export const createReportIssueSentEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: REPORT_ISSUE_SENT,
  screenName: SETTINGS_SCREEN,
  category: MENU_CATEGORY,
  action: TAP_SEND_ISSUE,
} as AnalyticsEvent);

export const createSwitchActiveUserEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: SWITCH_ACTIVE_USER,
  screenName: SETTINGS_SCREEN,
  category: ACCOUNTS_CATEGORY,
  action: TAP_SWITCH_ACTIVE_USER,
} as AnalyticsEvent);
