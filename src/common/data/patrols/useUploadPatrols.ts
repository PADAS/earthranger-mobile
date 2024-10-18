/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// External Dependencies
import axios from 'axios';
import { useCallback } from 'react';

// Internal Dependencies
import { useRetrievePendingSyncPatrol } from './useRetrievePendingSyncPatrol';
import log from '../../utils/logUtils';
import { PersistedPatrol, PersistedPatrolTypeSegment } from '../../types/types';
import { getPatrolSegment, postPatrol, updatePatrol as updateRemotePatrol } from '../../../api/patrolsAPI';
import { useUpdatePatrolData } from './useUpdatePatrolData';
import { useUpdatePatrolSegmentRemoteId } from './useUpdatePatrolSegmentRemoteId';
import { useRetrievePatrolTypeSegmentByPatrolId } from './useRetrievePatrolTypeSegmentByPatrolId';
import { TRACKED_BY_SUBJECT_ID_KEY } from '../../constants/constants';
import { useRetrievePatrolById } from './useRetrievePatrolById';
import { useRetrieveUserProfiles } from '../users/useRetrieveUserProfiles';
import { getApiStatus } from '../../utils/errorUtils';
import { ApiStatus } from '../../types/apiModels';
import { setIsSyncing, SyncSource } from '../../utils/syncUtils';
import { getStringForKey } from '../storage/keyValue';
import { PatrolStatus } from '../../utils/patrolsUtils';
import { useUpdatePatrolState } from './useUpdatePatrolState';
import { isEmptyString } from '../../utils/stringUtils';
import { useRetrieveUser } from '../users/useRetrieveUser';

enum PatrolAction {
  post = 'POST',
  stop = 'STOP',
}

export const useUploadPatrols = () => {
  // Hooks
  const { retrievePendingSyncPatrols, retrievePendingSyncPatrol } = useRetrievePendingSyncPatrol();
  const { retrievePatrolTypeSegmentByPatrolId } = useRetrievePatrolTypeSegmentByPatrolId();
  const { updatePatrolRemoteId } = useUpdatePatrolData();
  const { updatePatrolSegmentRemoteId } = useUpdatePatrolSegmentRemoteId();
  const { retrievePatrolById } = useRetrievePatrolById();
  const { retrieveUserProfileById } = useRetrieveUserProfiles();
  const { updatePatrolState } = useUpdatePatrolState();
  const { retrieveUserById } = useRetrieveUser();

  const uploadPatrols = useCallback(async (accessToken: string) => {
    try {
      const pendingSyncPatrols = await retrievePendingSyncPatrols();

      setIsSyncing(SyncSource.Patrols, true);

      const patrolsPayload = await Promise.all(pendingSyncPatrols.map(async (pendingSyncPatrol) => {
        const patrolId = pendingSyncPatrol.id.toString();

        let patrol = null;

        const isStop = !!(
          pendingSyncPatrol.state === PatrolStatus.Open && pendingSyncPatrol.updated_at
        );

        const patrolLeader = await getPatrolLeader(
          pendingSyncPatrol.account_id,
          pendingSyncPatrol.profile_id,
        );

        if (isStop && pendingSyncPatrol.remote_id) {
          patrol = {
            patrolId,
            type: PatrolAction.stop,
          };
        } else {
          const segments = await retrievePatrolTypeSegmentByPatrolId(patrolId);

          const patrolData = patrolRequestData(
            pendingSyncPatrol,
            segments,
            isStop,
            patrolLeader.patrolLeaderId,
          );

          patrol = {
            patrolData,
            patrolLeader: patrolLeader.profileRemoteId,
            patrolId,
            type: PatrolAction.post,
          };
        }

        return patrol;
      }));

      for (let i = 0, l = patrolsPayload.length; i < l; i++) {
        const patrol = patrolsPayload[i];

        if (patrol.type === PatrolAction.stop) {
          await stopPatrol(accessToken, patrol.patrolId || '');
        } else if (patrol.type === PatrolAction.post) {
          try {
            const patrolResponse = await postPatrol(
              accessToken,
              patrol.patrolData,
              patrol.patrolLeader,
            );

            if (patrolResponse.data && !isEmptyString(patrolResponse.data.id)) {
              await updatePatrolRemoteId(
                patrol.patrolId,
                patrolResponse.data.serial_number,
                patrolResponse.data.id,
                patrolResponse.data.state,
              );
            }

            log.debug('Patrols uploaded');
          } catch (error) {
            setIsSyncing(SyncSource.Patrols, false);
            if (axios.isAxiosError(error)) {
              const apiStatus = getApiStatus(error);

              if (apiStatus === ApiStatus.Forbidden) {
                await updatePatrolState(patrol.patrolId, 'unauthorized');
              }

              log.error('Error while uploading patrol ', error);
            } else {
              log.error('Error while uploading patrol ', error);
            }
            throw error;
          }
        }
      }
    } catch (error) {
      log.error('Error while uploading patrols ', error);
      setIsSyncing(SyncSource.Patrols, false);
      return getApiStatus(error);
    }
    setIsSyncing(SyncSource.Patrols, false);
    return ApiStatus.Succeeded;
  }, []);

  const stopPatrol = useCallback(async (accessToken: string, patrolId: string) => {
    try {
      setIsSyncing(SyncSource.Patrols, true);

      const [activePatrol, segments] = await Promise.all([
        retrievePatrolById(patrolId),
        retrievePatrolTypeSegmentByPatrolId(patrolId),
      ]);

      const patrolLeader = await getPatrolLeader(
        activePatrol.account_id,
        activePatrol.profile_id,
      );

      const patrolData = patrolRequestData(
        activePatrol,
        segments,
        true,
        patrolLeader.patrolLeaderId,
      );

      try {
        const patrolSegmentStatus = await getPatrolSegment(
          accessToken,
          segments[0].remote_id,
          patrolLeader.profileRemoteId,
        );

        if (patrolSegmentStatus === ApiStatus.Succeeded) {
          try {
            const patrolResponse = await updateRemotePatrol(
              accessToken,
              patrolData,
              activePatrol.remote_id,
              patrolLeader.profileRemoteId,
            );

            if (patrolResponse.data?.id) {
              await updatePatrolRemoteId(
                patrolId,
                patrolResponse.data.serial_number,
                patrolResponse.data.id,
                PatrolStatus.Done,
              );
            }

            log.debug('Patrol updated');
          } catch (error) {
            setIsSyncing(SyncSource.Patrols, false);

            if (axios.isAxiosError(error)) {
              log.error('Error while updating patrol ', error);
            } else {
              return getApiStatus(error);
            }

            throw error;
          }
        }
      } catch (error) {
        const apiStatus = getApiStatus(error);

        if (apiStatus === ApiStatus.NotFound && activePatrol.remote_id) {
          await updatePatrolState(patrolId, PatrolStatus.Canceled);
        }
      }
    } catch (error) {
      log.error('Error while updating patrol ', error);
      setIsSyncing(SyncSource.Patrols, false);
      return getApiStatus(error);
    }

    setIsSyncing(SyncSource.Patrols, false);
    return ApiStatus.Succeeded;
  }, []);

  const startPatrol = useCallback(async (patrolId: string, accessToken: string) => {
    try {
      setIsSyncing(SyncSource.Patrols, true);

      const pendingSyncPatrol = await retrievePendingSyncPatrol(patrolId);

      if (pendingSyncPatrol) {
        const segments = await retrievePatrolTypeSegmentByPatrolId(patrolId);

        try {
          const patrolLeader = await getPatrolLeader(
            pendingSyncPatrol.account_id,
            pendingSyncPatrol.profile_id,
          );
          const patrolData = patrolRequestData(
            pendingSyncPatrol,
            segments,
            false,
            patrolLeader.patrolLeaderId,
          );
          const patrolResponse = await postPatrol(
            accessToken,
            patrolData,
            patrolLeader.profileRemoteId,
          );

          if (patrolResponse.data && !isEmptyString(patrolResponse.data.id)) {
            await Promise.all([
              updatePatrolRemoteId(
                patrolId,
                patrolResponse.data.serial_number,
                patrolResponse.data.id,
                PatrolStatus.Open,
              ),
              patrolResponse.data.patrol_segments?.length > 0
                ? updatePatrolSegmentRemoteId(patrolId, patrolResponse.data.patrol_segments[0].id)
                : Promise.resolve(),
            ]);
          }

          log.debug('Active patrol uploaded');
        } catch (error) {
          setIsSyncing(SyncSource.Patrols, false);

          if (axios.isAxiosError(error)) {
            log.error('Error while uploading active patrol ', error);
          } else {
            return getApiStatus(error);
          }

          // noinspection ExceptionCaughtLocallyJS
          throw error;
        }
      }
    } catch (error) {
      log.error('Error while uploading active patrol ', error);
      setIsSyncing(SyncSource.Patrols, false);
      return getApiStatus(error);
    }

    setIsSyncing(SyncSource.Patrols, false);
    return ApiStatus.Succeeded;
  }, []);

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

  return { uploadPatrols, stopPatrol, startPatrol };
};

const patrolRequestData = (
  patrol: PersistedPatrol,
  segments: PersistedPatrolTypeSegment[],
  isStop: boolean,
  patrolLeaderId: string,
) => ({
  ...!patrol.remote_id && { created_at: patrol.created_at },
  state: isStop ? PatrolStatus.Done : patrol.state,
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
