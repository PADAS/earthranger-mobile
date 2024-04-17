// Internal Dependencies
import { getSecuredStringForKey } from '../../common/data/storage/utils';
import { LOCATION_TRACKING_CATEGORY } from '../model/constantsCategories';
import { MAP_SCREEN } from '../model/constantsScreens';
import { SITE_VALUE_KEY } from '../../common/constants/constants';
import { START_TRACKING_OVERLAY } from '../model/constantsEvents';
import { TAP_START_TRACKING } from '../model/constantsAction';
import AnalyticsEvent from '../model/analyticsEvent';

export const createStartTrackingEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: START_TRACKING_OVERLAY,
  screenName: MAP_SCREEN,
  category: LOCATION_TRACKING_CATEGORY,
  action: TAP_START_TRACKING,
} as AnalyticsEvent);
