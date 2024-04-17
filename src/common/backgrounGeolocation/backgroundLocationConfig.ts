// External Dependencies
import BackgroundGeolocation from 'react-native-background-geolocation';

// Internal Dependencies
import { USER_AGENT_VALUE } from '../../api/EarthRangerService';
import { COLORS_LIGHT } from '../constants/colors';
import { getDeviceUuid } from '../utils/deviceUuid';
import { getStringForKey } from '../data/storage/keyValue';
import { TRACKED_BY_SUBJECT_ID_KEY } from '../constants/constants';

// eslint-disable-next-line max-len
const backgroundLocationConfig = (
  trackUrl: string,
  userID: string,
  token: string,
  userProfileRemoteId: string | null,
) => ({
  distanceFilter: 25,
  stationaryRadius: 5,
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  speedJumpFilter: 85, // 306 km/h
  stopOnTerminate: false,
  startOnBoot: true,
  enableHeadless: true,
  heartbeatInterval: 600,
  preventSuspend: true,
  url: trackUrl,
  httpRootProperty: '.',
  notification: {
    smallIcon: 'mipmap/ic_notification',
    color: COLORS_LIGHT.erTeal,
  },
  locationTemplate: getLocationTemplate(userID),
  headers: {
    Authorization: `Bearer ${token}`,
    'User-Agent': USER_AGENT_VALUE,
    ...userProfileRemoteId && { 'user-profile': userProfileRemoteId },
  },
  batchSync: true,
  maxBatchSize: 25,
  autoSync: true,
  autoSyncThreshold: 0,
  debug: false,
  maxDaysToPersist: 90,
});

const getLocationTemplate = (userID: string) => {
  let remoteId = `"user_id": "${userID}"`;

  if (getStringForKey(TRACKED_BY_SUBJECT_ID_KEY)) {
    remoteId = `"subject_id": "${getStringForKey(TRACKED_BY_SUBJECT_ID_KEY)}"`;
  }

  return '{ "location": {"lat":<%= latitude %>,"lon":<%= longitude %>},'
    + '"recorded_at": "<%= timestamp  %>", "subject_subtype_id" : "ranger",'
    + `"manufacturer_id": "${getDeviceUuid()}", ${remoteId},`
    + '"additional": {"accuracy":<%= accuracy %> },'
    + '"source_type": "gps-radio", "message_key": "observation" }';
};

export { backgroundLocationConfig, getLocationTemplate };
