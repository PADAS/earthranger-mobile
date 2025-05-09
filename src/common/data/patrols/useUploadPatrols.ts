/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useRetrievePendingSyncPatrol } from './useRetrievePendingSyncPatrol';
import log from '../../utils/logUtils';
import { PersistedPatrol, PersistedPatrolTypeSegment } from '../../types/types';
import { postPatrol, updatePatrol as updateRemotePatrol } from '../../../api/patrolsAPI';
import { useUpdatePatrolData } from './useUpdatePatrolData';
import { useUpdatePatrolSegmentRemoteId } from './useUpdatePatrolSegmentRemoteId';
import { useRetrievePatrolTypeSegmentByPatrolId } from './useRetrievePatrolTypeSegmentByPatrolId';
import { TRACKED_BY_SUBJECT_ID_KEY } from '../../constants/constants';
import { useRetrieveUserProfiles } from '../users/useRetrieveUserProfiles';
import { getApiStatus } from '../../utils/errorUtils';
import { ApiResponseCodes } from '../../types/apiModels';
import { setIsSyncing, SyncSource } from '../../utils/syncUtils';
import { getStringForKey } from '../storage/keyValue';
import { PatrolState } from '../../utils/patrolsUtils';
import { isEmptyString } from '../../utils/stringUtils';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { useUpdatePatrolState } from './useUpdatePatrolState';

export const useUploadPatrols = () => {
  // Hooks
  const { retrievePendingSyncPatrols } = useRetrievePendingSyncPatrol();
  const { retrievePatrolTypeSegmentByPatrolId } = useRetrievePatrolTypeSegmentByPatrolId();
  const { updatePatrolRemoteId } = useUpdatePatrolData();
  const { updatePatrolSegmentRemoteId } = useUpdatePatrolSegmentRemoteId();
  const { retrieveUserProfileById } = useRetrieveUserProfiles();
  const { retrieveUserById } = useRetrieveUser();
  const { updatePatrolState } = useUpdatePatrolState();

  interface PatrolUploadResult {
    patrolId: string;
    status: ApiResponseCodes;
  }

  const uploadPatrols = useCallback(async (accessToken: string): Promise<PatrolUploadResult[]> => {
    const results: PatrolUploadResult[] = [];
    try {
      const pendingSyncPatrols = await retrievePendingSyncPatrols();
      setIsSyncing(SyncSource.Patrols, true);

      for (const pendingSyncPatrol of pendingSyncPatrols) {
        try {
          const status = await uploadSinglePatrol(accessToken, pendingSyncPatrol);
          results.push({
            patrolId: pendingSyncPatrol.id.toString(),
            status,
          });
        } catch (error) {
          const errorStatus = getApiStatus(error);
          results.push({
            patrolId: pendingSyncPatrol.id.toString(),
            status: errorStatus,
          });
          log.error(`Error uploading patrol ${pendingSyncPatrol.id}:`, error);
        }
      }
    } catch (error) {
      log.error('Error in uploadPatrols:', error);
      results.push({
        patrolId: 'general',
        status: ApiResponseCodes.ServerError,
      });
    } finally {
      setIsSyncing(SyncSource.Patrols, false);
    }

    return results;
  }, []);

  const uploadSinglePatrol = async (accessToken: string, pendingSyncPatrol: PersistedPatrol): Promise<ApiResponseCodes> => {
    const patrolId = pendingSyncPatrol.id.toString();
    const segments = await retrievePatrolTypeSegmentByPatrolId(patrolId);
    const patrolLeader = await getPatrolLeader(pendingSyncPatrol.account_id, pendingSyncPatrol.profile_id);

    const isStopped = !!pendingSyncPatrol.updated_at;

    log.info(`Uploading patrol ${patrolId}: isStopped: ${isStopped}, state: ${pendingSyncPatrol.state}, updated_at: ${pendingSyncPatrol.updated_at}, remote_id: ${pendingSyncPatrol.remote_id}`);

    const patrolData = patrolRequestData(pendingSyncPatrol, segments, isStopped, patrolLeader.patrolLeaderId);

    try {
      let patrolResponse;
      if (pendingSyncPatrol.remote_id && isStopped) {
        // Stopping an online patrol
        patrolResponse = await updateRemotePatrol(accessToken, patrolData, pendingSyncPatrol.remote_id, patrolLeader.profileRemoteId);
      } else {
        // Starting a new patrol (online or offline) or uploading a completed offline patrol
        patrolResponse = await postPatrol(accessToken, patrolData, patrolLeader.profileRemoteId);
      }

      if (patrolResponse && patrolResponse.data && !isEmptyString(patrolResponse.data.id)) {
        await updatePatrolAfterUpload(patrolId, patrolResponse.data);
        return ApiResponseCodes.Succeeded;
      }
      log.error('Unexpected response from server when uploading patrol:', patrolResponse);
      return ApiResponseCodes.BadRequest;
    } catch (error) {
      handleApiError(error, patrolId);
      return getApiStatus(error);
    }
  };

  const updatePatrolAfterUpload = async (patrolId: string, responseData: any) => {
    try {
      await Promise.all([
        updatePatrolRemoteId(patrolId, responseData.serial_number, responseData.id, responseData.state),
        responseData.patrol_segments?.length > 0
          ? updatePatrolSegmentRemoteId(patrolId, responseData.patrol_segments[0].id)
          : Promise.resolve(),
      ]);
      log.info(`Successfully updated local database for patrol ${patrolId} with state: ${responseData.state}`);
    } catch (error) {
      log.error(`Error updating local database for patrol ${patrolId}:`, error);
    }
  };

  const handleApiError = async (error: unknown, patrolId: string) => {
    const status = getApiStatus(error);
    switch (status) {
      case ApiResponseCodes.Unauthorized:
      case ApiResponseCodes.Forbidden:
        log.warn(`Unauthorized access for patrol ${patrolId}`);
        await updatePatrolState(patrolId, PatrolState.Unauthorized);
        break;
      case ApiResponseCodes.NotFound:
        log.warn(`Forbidden access for patrol ${patrolId}`);
        await updatePatrolState(patrolId, PatrolState.Rejected);
        break;
      case ApiResponseCodes.Conflict:
        log.warn(`Conflict for patrol ${patrolId}`);
        await updatePatrolState(patrolId, PatrolState.Duplicate);
        break;
      default:
        log.error(`Unexpected error (status ${status}) for patrol ${patrolId}:`, error);
        break;
    }
  };

  const getPatrolLeader = useCallback(async (accountId: number, profileId: number) => {
    const patrolLeader = {
      profileRemoteId: '',
      patrolLeaderId: '',
    };
    let profileSubjectId;
    if (profileId) {
      const profile = await retrieveUserProfileById(profileId?.toString() || '');
      if (profile) {
        patrolLeader.profileRemoteId = profile.remote_id;
        profileSubjectId = profile.subject_id;
      }
    }

    if (getStringForKey(TRACKED_BY_SUBJECT_ID_KEY)) {
      patrolLeader.patrolLeaderId = getStringForKey(TRACKED_BY_SUBJECT_ID_KEY) || '';
    } else if (profileId) {
      patrolLeader.patrolLeaderId = profileSubjectId || '';
    } else {
      const user = await retrieveUserById(accountId.toString());
      if (user) {
        patrolLeader.patrolLeaderId = user.subject_id;
      }
    }

    return patrolLeader;
  }, []);

  return { uploadPatrols };
};

const patrolRequestData = (
  patrol: PersistedPatrol,
  segments: PersistedPatrolTypeSegment[],
  isStop: boolean,
  patrolLeaderId: string,
) => ({
  ...!patrol.remote_id && { created_at: patrol.created_at },
  state: isStop ? PatrolState.Done : patrol.state,
  patrol_segments: segments.length > 0
    ? segments.map((segment) => segmentsRequestData(patrol, segment, patrolLeaderId))
    : [],
  ...!patrol.remote_id && { title: patrol.title },
});

const segmentsRequestData = (
  patrol: PersistedPatrol,
  segment: PersistedPatrolTypeSegment,
  patrolLeader: string,
) => ({
  id: segment.remote_id,
  patrol_type: segment.patrol_type,
  ...!patrol.remote_id && {
    start_location: segment.start_latitude && segment.start_longitude ? {
      latitude: segment.start_latitude,
      longitude: segment.start_longitude,
    } : null,
  },
  time_range: {
    start_time: segment.start_time,
    end_time: segment.end_time ? segment.end_time : null,
  },
  end_location: segment.stop_latitude && segment.stop_longitude ? {
    latitude: segment.stop_latitude,
    longitude: segment.stop_longitude,
  } : null,
  leader: {
    id: patrolLeader,
    content_type: 'observations.subject',
  },
});
