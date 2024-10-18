// Internal Dependencies
import { cleanSession } from '../data/storage/session';
import { clearSessionAction } from '../state/actions/sessionActions';
import {
  getBoolForKey, setBoolForKey, setNumberForKey, setStringForKey,
} from '../data/storage/keyValue';
import {
  LOCATION_STATUS_KEY,
  REMEMBER_ME_CHECKBOX_KEY,
  SITE_VALUE_KEY,
  USER_NAME_KEY,
  USER_SUBJECT_NAME_KEY,
  REPORTS_SUBMITTED_KEY,
  COORDINATES_FORMAT_KEY,
  PHOTO_QUALITY_KEY,
  TRACKED_BY_SUBJECT_ID_KEY,
  TRACKED_BY_SUBJECT_NAME_KEY,
  MERGE_CATEGORIES_KEY,
  UPLOAD_PHOTOS_WIFI,
  REPORTS_SYNCING,
  PATROLS_SYNCING,
  LOCAL_DB_SYNCING,
  BASEMAP_TOPO_LOCAL,
  BASEMAP_SATELLITE_LOCAL,
  BASEMAP_STREET_LOCAL,
  PATROL_INFO_ENABLED,
  IS_STATUS_FILTER_DRAFT_SELECTED,
  IS_STATUS_FILTER_PENDING_SELECTED,
  IS_STATUS_FILTER_SYNCED_SELECTED,
  IS_STATUS_FILTER_ENABLED,
} from '../constants/constants';
import { setSecuredStringForKey } from '../data/storage/utils';

export const deleteSession = async () => {
  // Redux cleaning
  clearSessionAction();

  // Local storage cleaning
  cleanSession();
  setBoolForKey(LOCATION_STATUS_KEY, false);
  setBoolForKey(PATROL_INFO_ENABLED, false);
  setNumberForKey(REPORTS_SUBMITTED_KEY, 0);
  setStringForKey(COORDINATES_FORMAT_KEY, '');
  setStringForKey(PHOTO_QUALITY_KEY, '');
  setStringForKey(TRACKED_BY_SUBJECT_ID_KEY, '');
  setStringForKey(TRACKED_BY_SUBJECT_NAME_KEY, '');
  setBoolForKey(MERGE_CATEGORIES_KEY, false);
  setBoolForKey(UPLOAD_PHOTOS_WIFI, false);
  setBoolForKey(REPORTS_SYNCING, false);
  setBoolForKey(PATROLS_SYNCING, false);
  setBoolForKey(LOCAL_DB_SYNCING, false);
  setStringForKey(BASEMAP_TOPO_LOCAL, '');
  setStringForKey(BASEMAP_SATELLITE_LOCAL, '');
  setStringForKey(BASEMAP_STREET_LOCAL, '');
  resetUserEventFilters();

  const checkBoxValue = getBoolForKey(REMEMBER_ME_CHECKBOX_KEY);

  if (!checkBoxValue) {
    setSecuredStringForKey(SITE_VALUE_KEY, '');
    setSecuredStringForKey(USER_NAME_KEY, '');
    setSecuredStringForKey(USER_SUBJECT_NAME_KEY, '');
  }
};

export const resetUserEventFilters = () => {
  setBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED, false);
  setBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED, false);
  setBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED, false);
  setBoolForKey(IS_STATUS_FILTER_ENABLED, false);
};
