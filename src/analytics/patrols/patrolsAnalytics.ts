// Internal Dependencies
import { getSecuredStringForKey } from '../../common/data/storage/utils';
import { MAP_SCREEN, PATROL_DETAILS_SCREEN } from '../model/constantsScreens';
import { PATROL_CATEGORY } from '../model/constantsCategories';
import { SITE_VALUE_KEY } from '../../common/constants/constants';
import { END_PATROL_DETAIL_VIEW, START_PATROL_OVERLAY } from '../model/constantsEvents';
import { TAP_END_PATROL, TAP_START_PATROL } from '../model/constantsAction';
import AnalyticsEvent from '../model/analyticsEvent';

export const createStartPatrolEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: START_PATROL_OVERLAY,
  screenName: MAP_SCREEN,
  category: PATROL_CATEGORY,
  action: TAP_START_PATROL,
} as AnalyticsEvent);

export const createStopPatrolEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: END_PATROL_DETAIL_VIEW,
  screenName: PATROL_DETAILS_SCREEN,
  category: PATROL_CATEGORY,
  action: TAP_END_PATROL,
} as AnalyticsEvent);
