import { SITE_VALUE_KEY } from '../../common/constants/constants';
import { getSecuredStringForKey } from '../../common/data/storage/utils';
import AnalyticsEvent from '../model/analyticsEvent';
import { TAP_MAP, TAP_MENU } from '../model/constantsAction';
import { MAP_TAB_SELECTED, MENU_TAB_SELECTED } from '../model/constantsEvents';
import { MAP_SCREEN, SETTINGS_SCREEN } from '../model/constantsScreens';
import { MENU_CATEGORY } from '../model/constantsCategories';

export const createMenuTabSelectedEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: MENU_TAB_SELECTED,
  screenName: MAP_SCREEN,
  category: MENU_CATEGORY,
  action: TAP_MENU,
} as AnalyticsEvent);

export const createMapTabSelectedEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: MAP_TAB_SELECTED,
  screenName: SETTINGS_SCREEN,
  category: MENU_CATEGORY,
  action: TAP_MAP,
} as AnalyticsEvent);
