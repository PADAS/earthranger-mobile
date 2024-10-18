// External Dependencies
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

// Internal Dependencies
import { SITE_VALUE_KEY } from '../common/constants/constants';
import { getSecuredStringForKey } from '../common/data/storage/utils';

// ------------------------------------------------------------------------
// DOMAIN CONSTANTS
// ------------------------------------------------------------------------

export const SITE = {
  domain: '.pamdas.org',
  name: `https://${getSecuredStringForKey(SITE_VALUE_KEY)}`,
  mock: 'http://10.0.0.4:3001', // Set this value to your development machine's IP address
};

export const STATIC_RESOURCES = `https://%host%${SITE.domain}/static/sprite-src/%icon%.svg`;
export const SUBJECTS_STATIC_RESOURCES = `https://%host%${SITE.domain}%icon%`;

export const USER_AGENT_VALUE = `${DeviceInfo.getApplicationName()}Mobile/${DeviceInfo.getVersion()}.${DeviceInfo.getBuildNumber()}; ${DeviceInfo.getBrand()}; ${DeviceInfo.getModel()}`;

// Third-Party URLs

export const MAPBOX_STATIC_IMAGES_API_URL = 'https://api.mapbox.com/styles/v1/mapbox/#MAP_STYLE#/static';

export const MAPBOX_STYLE_STREETS = 'streets-v11';

export const MAPBOX_STYLE_TOPO = 'outdoors-v11';

export const MAPBOX_STYLE_SATELLITE = 'satellite-v9';

// ------------------------------------------------------------------------
// Public API Constants
// ------------------------------------------------------------------------

export const API_V1 = '/api/v1.0';

export const API_PATROLS = `${API_V1}/activity/patrols`;

export const API_PATROL_TYPES = `${API_PATROLS}/types`;

export const API_ATTACHMENT_FILES = '/files/';

export const API_ATTACHMENT_NOTES = '/notes/';

export const API_EVENT = `${API_V1}/activity/event`;

export const API_EVENTS = `${API_V1}/activity/events`;

export const API_SCHEMA = `${API_V1}/activity/events/schema`;

export const API_EVENT_TYPES = `${API_EVENTS}/eventtypes`;

export const API_EVENT_CATEGORIES = `${API_EVENTS}/categories`;

export const API_SENSORS = `${API_V1}/sensors`;

export const API_TRACK_OBSERVATIONS = `${API_SENSORS}/ertrack/and-mobile/status`;

export const API_USER = `${API_V1}/user`;

export const API_USER_ME = `${API_USER}/me`;

export const API_PROFILES = '/profiles';

export const API_PATROLS_SEGMENTS = `${API_PATROLS}/segments`;

export const API_PATROLS_EVENTS = '/events/';

export const API_PATROLS_TRACKED_BY = `${API_PATROLS}/trackedby`;

export const API_SUBJECT_GROUPS = `${API_V1}/subjectgroups`;

export const OAUTH_TOKEN = '/oauth2/token/';

// ------------------------------------------------------------------------
// Public API Functions
// ------------------------------------------------------------------------

export const assignCurrentSiteName = () => {
  SITE.name = `https://${getSecuredStringForKey(SITE_VALUE_KEY)}`;
};

export const getApiUrl = (endpoint: string) => `${SITE.name}${SITE.domain}${endpoint}`;

export const getMockApiUrl = (endpoint: string) => `${SITE.mock}${endpoint}`;

export const client = (accessToken: string, extraHeaders?: any) => (axios.create({
  baseURL: `${SITE.name}${SITE.domain}`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'User-Agent': USER_AGENT_VALUE,
    'Cache-control': 'no-cache',
    ...extraHeaders && extraHeaders,
  },
}));

export const mockClient = (accessToken: string) => (axios.create({
  baseURL: `${SITE.mock}`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
}));

export const sessionClient = () => (axios.create({
  baseURL: `${SITE.name}${SITE.domain}`,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    'User-Agent': USER_AGENT_VALUE,
  },
}));

export const getMapBoxStaticImageUrl = (mapboxStyle: 'streets-v11' | 'outdoors-v11' | 'satellite-v9' | string) => MAPBOX_STATIC_IMAGES_API_URL.replace('#MAP_STYLE#', mapboxStyle);
