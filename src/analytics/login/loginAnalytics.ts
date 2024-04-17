import AnalyticsEvent from '../model/analyticsEvent';
import { getSecuredStringForKey } from '../../common/data/storage/utils';
import { LOGIN_BUTTON_CLICKED } from '../model/constantsAction';
import { LOGIN_ERROR_EVENT, LOGIN_SUCCESS_EVENT } from '../model/constantsEvents';
import { LOGIN_SCREEN } from '../model/constantsScreens';
import { LOGIN_CATEGORY } from '../model/constantsCategories';
import { SITE_VALUE_KEY } from '../../common/constants/constants';

export const createLoginSuccessEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: LOGIN_SUCCESS_EVENT,
  screenName: LOGIN_SCREEN,
  category: LOGIN_CATEGORY,
  action: LOGIN_BUTTON_CLICKED,
} as AnalyticsEvent);

export const createLoginErrorEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: LOGIN_ERROR_EVENT,
  screenName: LOGIN_SCREEN,
  category: LOGIN_CATEGORY,
  action: LOGIN_BUTTON_CLICKED,
} as AnalyticsEvent);
