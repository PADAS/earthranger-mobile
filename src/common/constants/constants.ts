// External Dependencies
import { Platform } from 'react-native';

// Internal Dependencies
import { COLORS_LIGHT } from './colors';

// ------------------------------------------------------------------
// Data
// ------------------------------------------------------------------
export const DATABASE_FILE_NAME = 'earthranger.db';
export const TRANSISTOR_LOCATION_MANAGER = 'transistor_location_manager';

// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
export const DATE_FORMAT_HHMM_DD_MMM_YYYY = 'HH:mm DD MMM YYYY';
export const DATE_FORMAT_YYYY_MM_DD_HH_MM = 'YYYY MMM DD, HH:mm';

// ------------------------------------------------------------------
// Network
// ------------------------------------------------------------------
export const NETWORK_ERROR = 'Network Error';

// ------------------------------------------------------------------
// Platform
// ------------------------------------------------------------------
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

// ------------------------------------------------------------------
// Events
// ------------------------------------------------------------------
export const IS_STATUS_FILTER_DRAFT_SELECTED = 'StatusFilterDraft';
export const IS_STATUS_FILTER_PENDING_SELECTED = 'StatusFilterPending';
export const IS_STATUS_FILTER_SYNCED_SELECTED = 'StatusFilterSynced';
export const IS_STATUS_FILTER_ENABLED = 'IsStatusFilterEnabled';
export const LAST_SYNC_REPORTS_TIME_KEY = 'lastSyncReportsTimeKey';
export const REPORTS_SUBMITTED_KEY = 'reportsSubmitted';

// ------------------------------------------------------------------
// Event Emitter Keys
// ------------------------------------------------------------------
export const BOTTOM_SHEET_NAVIGATOR = 'BOTTOM_SHEET_NAVIGATOR';
export const BOTTOM_SHEET_NAVIGATOR_STATUS_INDEX = 'BOTTOM_SHEET_NAVIGATOR_STATUS';
export const COORDINATES_FORMAT_KEY = 'coordinatesFormatKey';
export const EVENT_FILTERS_CHANGED = 'EVENT_FILTERS_CHANGED';
export const LOCAL_DB_SYNCING = 'LOCAL_DB_SYNCING';
export const REPORTS_SYNCING = 'REPORTS_SYNCING';
export const PATROLS_SYNCING = 'PATROLS_SYNCING';
export const START_PATROL_EVENT = 'START_PATROL_EVENT';

// ------------------------------------------------------------------
// Experimental Features
// ------------------------------------------------------------------
export const EXPERIMENTAL_FEATURES_FLAG_KEY = 'experimentalFeaturesGlagKey';
export const SETTINGS_VIEW_DISAPPEAR_KEY = 'settingsViewDisappearKey';

// ------------------------------------------------------------------
// Geometry
// ------------------------------------------------------------------
export const COORDINATES_SCALE = 100000;
export const MAPBOX_MAXIMUM_LATITUDE = 85.0511;

// ------------------------------------------------------------------
// Login
// ------------------------------------------------------------------
export const AREA_INSTRUCTIONS_VIEWED = 'areaInstructionsViewed';
export const PROMINENT_DISCLOSURE_KEY = 'prominentDisclosureKey';
export const REMEMBER_ME_CHECKBOX_KEY = 'rememberMeCheckBoxKey';
export const AUTH_STATE = 'authState';
export const SESSION_KEY = 'sessionKey';
export const SITE_VALUE_KEY = 'siteValueKey';
export const SUBJECT_ID_KEY = 'subjectIdKey';
export const USER_ID_KEY = 'userIdKey';
export const PARENT_USER_REMOTE_ID_KEY = 'parentUserRemoteIdKey';
export const USER_NAME_KEY = 'userNameKey';
export const USER_SUBJECT_NAME_KEY = 'userSubjectNameKey';
export const ACTIVE_USER_NAME_KEY = 'activeUserNameKey';
export const USER_REMOTE_ID_KEY = 'userRemoteIdKey';

// ------------------------------------------------------------------
// Patrols
// ------------------------------------------------------------------
export const ACTIVE_PATROL_KEY = 'activePatrolKey';
export const ACTIVE_PATROL_ID_KEY = 'activePatrolIdKey';
export const ACTIVE_USER_HAS_PATROLS_PERMISSION = 'activeUserHasPatrolsPermission';
export const LAST_SYNC_PATROLS_TIME_KEY = 'lastSyncPatrolsTimeKey';
export const PATROL_DISTANCE = 'patrolDistance';
export const PATROL_INFO_ENABLED = 'PatrolInfoEnabled';
export const PATROL_INFO_EVENT_TYPE_VALUE = 'PatrolInfoEventTypeValue';
export const PATROL_STATUS_KEY = 'patrolStatusKey';
export const PATROL_START_LOCATION = 'PatrolStartLocation';
export const PATROL_TYPE = 'patrolType';
export const PATROL_TYPE_DISPLAY = 'patrolTypeDisplay';
export const UPDATE_PATROL_TYPES_UI = 'updatePatrolTypesUI';

// ------------------------------------------------------------------
// Settings
// ------------------------------------------------------------------
export const BASEMAP_KEY = 'basemapKey';
export const BASEMAP_TOPO_LOCAL = 'basemapTopoLocal';
export const BASEMAP_STREET_LOCAL = 'basemapStreetLocal';
export const BASEMAP_SATELLITE_LOCAL = 'basemapSatelliteLocal';
export const MERGE_CATEGORIES_KEY = 'mergeCategoriesKey';
export const PHOTO_QUALITY_KEY = 'PhotoQualityKey';
export const SAVE_TO_CAMERA_ROLL = 'SaveToCameraRoll';
export const STORE_LANGUAGE_KEY = 'language';
export const UPLOAD_PHOTOS_WIFI = 'UploadPhotosWifi';
export const CUSTOM_CENTER_COORDS_ENABLED = 'CustomCenterCoordsEnabled';
export const CUSTOM_CENTER_COORDS_LAT = 'CustomCenterCoordsLat';
export const CUSTOM_CENTER_COORDS_LON = 'CustomCenterCoordsLon';

// ------------------------------------------------------------------
// Tracking
// ------------------------------------------------------------------
export const DEVICE_UUID = 'deviceUuid';
export const IS_DEVICE_TRACKING = 'isDeviceTrackingKey';
export const LAST_SYNC_LOCATION_TIME_KEY = 'lastSyncLocationTimeKey';
export const LOCATION_STATUS_KEY = 'locationStatusKey';
export const SHOW_USER_TRAILS_ENABLED_KEY = 'showUserTrailsEnabledKey';
export const SYNC_TRACKS_MANUALLY = 'syncTracksManually';
export const TRACKED_BY_SUBJECT_NAME_KEY = 'trackBySubjectNameKey';
export const TRACKED_BY_SUBJECT_ID_KEY = 'tracedBySubjectIdKey';
export const TRACKED_BY_SUBJECT_STATUS_KEY = 'tracedBySubjectStatusKey';

// ------------------------------------------------------------------
// UI
// ------------------------------------------------------------------
export const ALERT_BUTTON_BACKGROUND_COLOR_BLUE = COLORS_LIGHT.brightBlue;
export const ALERT_BUTTON_BACKGROUND_COLOR_RED = COLORS_LIGHT.red;
export const SCREEN_FIT_700_TO_600 = 0.04;
export const SCREEN_FIT_LESS_THAN_600 = 0.4;
export const ELEMENT_INSPECTOR_WIDTH = 140;

// ------------------------------------------------------------------
// Subjects
// ------------------------------------------------------------------
export const SELECTED_SUBJECT_IN_MAP = 'selectedSubjectInMap';
export const LAST_SYNC_SUBJECTS_TIME = 'lastSyncSubjectsTime';

// ------------------------------------------------------------------
// STORAGE
// ------------------------------------------------------------------
export const STORAGE_KEYS = {
  SUBJECTS_KEY: 'SUBJECTS_KEY',
};
