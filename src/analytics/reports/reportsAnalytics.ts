// Internal Dependencies
import { getSecuredStringForKey } from '../../common/data/storage/utils';
import {
  REPORTS_VIEW_SCREEN,
  REPORT_DRAFT_SCREEN,
  REPORT_FORM_SCREEN,
  REPORT_RECORD_AREA_SCREEN,
} from '../model/constantsScreens';
import { REPORT_CATEGORY } from '../model/constantsCategories';
import { SITE_VALUE_KEY } from '../../common/constants/constants';
import {
  ADD_REPORT,
  DISPLAY_RECORD_REPORT_AREA,
  OPEN_REPORT_DRAFT, REMOVE_REPORT_DRAFT,
  SAVE_REPORT_DRAFT,
  START_RECORD_REPORT_AREA,
  SUBMIT_RECORD_REPORT_AREA,
  SUBMIT_REPORT,
  UNDO_REMOVE_REPORT_DRAFT,
} from '../model/constantsEvents';
import {
  TAP_ADD_REPORT_BUTTON,
  TAP_RECORD_REPORT_AREA, TAP_REPORT_DRAFT_DELETE_BUTTON,
  TAP_REPORT_DRAFT_LIST_ITEM,
  TAP_SAVE_DRAFT_BUTTON,
  TAP_SUBMIT_REPORT_AREA,
  TAP_SUBMIT_REPORT_BUTTON,
  TAP_UNDO_REPORT_DRAFT_DELETE,
} from '../model/constantsAction';
import AnalyticsEvent from '../model/analyticsEvent';

export const createRecordReportAreaEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: DISPLAY_RECORD_REPORT_AREA,
  screenName: REPORT_FORM_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_RECORD_REPORT_AREA,
} as AnalyticsEvent);

export const createRecordReportAreaStartEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: START_RECORD_REPORT_AREA,
  screenName: REPORT_RECORD_AREA_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_RECORD_REPORT_AREA,
} as AnalyticsEvent);

export const createRecordReportAreaSubmitEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: SUBMIT_RECORD_REPORT_AREA,
  screenName: REPORT_RECORD_AREA_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_SUBMIT_REPORT_AREA,
} as AnalyticsEvent);

export const createSaveReportDraftEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: SAVE_REPORT_DRAFT,
  screenName: REPORT_FORM_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_SAVE_DRAFT_BUTTON,
} as AnalyticsEvent);

export const createOpenReportDraftEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: OPEN_REPORT_DRAFT,
  screenName: REPORT_DRAFT_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_REPORT_DRAFT_LIST_ITEM,
} as AnalyticsEvent);

export const removeReportDraftEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: REMOVE_REPORT_DRAFT,
  screenName: REPORT_DRAFT_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_REPORT_DRAFT_DELETE_BUTTON,
} as AnalyticsEvent);

export const undoDeleteDraftEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: UNDO_REMOVE_REPORT_DRAFT,
  screenName: REPORT_DRAFT_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_UNDO_REPORT_DRAFT_DELETE,
} as AnalyticsEvent);

export const submitReportEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: SUBMIT_REPORT,
  screenName: REPORT_FORM_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_SUBMIT_REPORT_BUTTON,
} as AnalyticsEvent);

export const addReportEvent = () => ({
  siteName: getSecuredStringForKey(SITE_VALUE_KEY),
  eventName: ADD_REPORT,
  screenName: REPORTS_VIEW_SCREEN,
  category: REPORT_CATEGORY,
  action: TAP_ADD_REPORT_BUTTON,
} as AnalyticsEvent);
