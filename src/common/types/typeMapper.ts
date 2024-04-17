// External Dependencies
import dayjs from 'dayjs';

// Internal Dependencies
import { DATE_FORMAT_YYYY_MM_DD_HH_MM } from '../constants/constants';
import { PatrolDetail, PersistedPatrolDetail } from './types';

export const mapToPatrolDetail = (patrolDetail: PersistedPatrolDetail) => ({
  remoteId: patrolDetail.remote_id,
  title: patrolDetail.title,
  serialNumber: patrolDetail.serial_number,
  startLatitude: patrolDetail.start_latitude,
  startLongitude: patrolDetail.start_longitude,
  startTime: patrolDetail.start_time,
  iconSVG: patrolDetail.icon_svg,
  startTimeFormatted: patrolDetail.start_time
    ? dayjs(patrolDetail.start_time.toString()).format(DATE_FORMAT_YYYY_MM_DD_HH_MM)
    : '',
} as unknown as PatrolDetail);
