/* eslint-disable no-await-in-loop */
// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';
import dayjs from 'dayjs';
import { exists } from 'react-native-fs';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

// Internal Dependencies
import { isEmpty, isNumber } from 'lodash-es';
import { useRetrieveReportPendingSync } from './useRetrieveReportPendingSync';
import { useUpdateEventRemoteId } from './useUpdateReportRemoteId';
import { postEvent, postPatrolSegmentEvent } from '../../../api/reportsAPI';
import { logGeneral, logSync } from '../../utils/logUtils';
import { useRetrieveUnsyncedEventsAttachments } from './useRetrieveUnsyncedEventsAttachments';
import { useReportUploadFile } from './userReportUploadFile';
import { ApiStatus, FileRequest } from '../../types/apiModels';
import { useUpdateReportAttachmentRemoteId } from './useUpdateReportAttachmentRemoteId';
import { useReportCreateNote } from './useCreateReportNote';
import { useRetrieveReportedByInfo } from '../users/useRetrieveReportedByInfo';
import { Geometry, ReportFormEventAttachments, ReportFormFullEvent } from '../../types/types';
import { getApiStatus } from '../../utils/errorUtils';
import { setIsSyncing, SyncSource } from '../../utils/syncUtils';
import { useUpdateReportEvent } from './useUpdateReportEvent';
import { getSession } from '../storage/session';
import { ATTACHMENTS_FOLDER } from '../../utils/imageUtils';
import { getBoolForKey } from '../storage/keyValue';
import { UPLOAD_PHOTOS_WIFI } from '../../constants/constants';
import { useUpdateReportAttachments } from './useUpdateReportAttachments';

enablePromise(true);

// Constants
const TAG = 'useUploadReports';

export const useUploadReports = () => {
  // Hooks
  const { retrieveReportsPendingSync } = useRetrieveReportPendingSync();
  const {
    retrieveUnsyncedEventsAttachments,
  } = useRetrieveUnsyncedEventsAttachments();
  const { uploadReportFile } = useReportUploadFile();
  const { updateEventRemoteId } = useUpdateEventRemoteId();
  const { updateReportAttachmentRemoteId } = useUpdateReportAttachmentRemoteId();
  const { reportCreateNote } = useReportCreateNote();
  const { retrieveProfileReportedByInfo, retrieveUserReportedByInfo } = useRetrieveReportedByInfo();
  const { updateReportEventState } = useUpdateReportEvent();
  const { updateReportAttachmentStatus } = useUpdateReportAttachments();

  const uploadReportAndAttachments = useCallback(async () => {
    setIsSyncing(SyncSource.Reports, true);
    const session = getSession();
    if (session?.access_token) {
      let reportStatus = null;
      const pendingSyncReports = await retrieveReportsPendingSync();

      if (pendingSyncReports?.length > 0) {
        reportStatus = await uploadReportEvents(
          session.access_token,
          pendingSyncReports,
        );
      }

      let attachmentStatus = null;
      const pendingSyncAttachments = await retrieveUnsyncedEventsAttachments();
      if (pendingSyncAttachments?.length > 0) {
        attachmentStatus = await uploadEventAttachments(
          session.access_token,
          pendingSyncAttachments,
        );
      }

      setIsSyncing(SyncSource.Reports, false);
      return { reportStatus, attachmentStatus };
    }
    setIsSyncing(SyncSource.Reports, false);
    return { reportStatus: ApiStatus.Unauthorized, attachmentStatus: ApiStatus.Unauthorized };
  }, []);

  const uploadReportEvents = useCallback(async (
    accessToken: string,
    pendingSyncReports: ReportFormFullEvent[],
  ) => {
    try {
      const eventsPayload = await Promise.all(pendingSyncReports.map(async (pendingSyncReport) => {
        // Get reported_by data
        const reportedByData = pendingSyncReport.account_id && pendingSyncReport.profile_id
          ? await retrieveProfileReportedByInfo(pendingSyncReport.profile_id)
          : await retrieveUserReportedByInfo(pendingSyncReport.account_id);

        // Build payload
        const eventPayload : any = {
          event_type: pendingSyncReport.value,
          event_details: JSON.parse(pendingSyncReport.event_values),
          time: isNumber(pendingSyncReport.created_at)
            ? dayjs(JSON.parse(pendingSyncReport.created_at)).format()
            : pendingSyncReport.created_at,
          reported_by: reportedByData.id
            ? { content_type: reportedByData.contentType || 'observations.subject', id: reportedByData.id }
            : null,
        };

        // Add geometry or location
        if (pendingSyncReport.geometry_type.toLowerCase() === Geometry.polygon) {
          if (!isEmpty(pendingSyncReport.geometry)) {
            eventPayload.geometry = JSON.parse(pendingSyncReport.geometry);
          }
        } else {
          eventPayload.location = {
            latitude: pendingSyncReport.latitude,
            longitude: pendingSyncReport.longitude,
          };
        }

        const isPatrolSegmentEvent = pendingSyncReport.patrol_segment_id
          && !isEmpty(pendingSyncReport.segment_remote_id);

        return {
          reportedByData,
          eventPayload,
          isPatrolSegmentEvent,
          patrolSegmentRemoteId: pendingSyncReport.segment_remote_id || null,
          eventLocalId: pendingSyncReport.id,
        };
      }));

      const requestsResponses = [];

      // Upload patrols in order to avoid getting wrong data in the server's history
      for (let i = 0, l = eventsPayload.length; i < l; i++) {
        const {
          reportedByData,
          eventPayload,
          isPatrolSegmentEvent,
          patrolSegmentRemoteId,
          eventLocalId,
        } = eventsPayload[i];

        let requestResponse;

        if (isPatrolSegmentEvent && patrolSegmentRemoteId) {
          try {
            requestResponse = await postPatrolSegmentEvent(
              accessToken,
              patrolSegmentRemoteId,
              eventPayload,
              reportedByData?.profileRemoteId,
            );
          } catch (error) {
            if (getApiStatus(error) === ApiStatus.NotFound
              || getApiStatus(error) === ApiStatus.BadRequest) {
              try {
                requestResponse = await postEvent(
                  accessToken,
                  eventPayload,
                  reportedByData?.profileRemoteId,
                );
              } catch (postEventError) {
                logSync.error('Could not upload event report', postEventError);
                await updateReportEventState(eventLocalId, getApiStatus(postEventError).toString() || '');
              }
            } else {
              await updateReportEventState(eventLocalId, getApiStatus(error).toString() || '');
            }
          }
        } else {
          try {
            requestResponse = await postEvent(
              accessToken,
              eventPayload,
              reportedByData?.profileRemoteId,
            );
          } catch (error) {
            logSync.error('Could not upload event report', error);
            await updateReportEventState(eventLocalId, getApiStatus(error).toString() || '');
          }
        }

        requestsResponses.push({
          eventLocalId,
          data: requestResponse,
        });
      }

      await Promise.all(requestsResponses.map(async (requestResponse) => {
        const { eventLocalId, data } = requestResponse;
        if (data && data.data.id) {
          await updateEventRemoteId([
            data.data.id.toString(),
            data.data.serial_number,
            eventLocalId,
          ]);
        }
      }));

      return ApiStatus.Succeeded;
    } catch (error) {
      logSync.debug(`[${TAG}] - Could not upload event(s) - ${error}`);
      return getApiStatus(error);
    }
  }, []);

  const uploadEventAttachments = useCallback(async (
    accessToken: string,
    pendingSyncAttachments: ReportFormEventAttachments[],
  ) => {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const attachment of pendingSyncAttachments) {
        const reportedByData = attachment.account_id && attachment.profile_id
          ? await retrieveProfileReportedByInfo(attachment.profile_id)
          : await retrieveUserReportedByInfo(attachment.account_id);

        const networkState = await NetInfo.fetch();

        if (networkState.isConnected && networkState.isInternetReachable) {
          if (attachment.type === 'photo') {
            // eslint-disable-next-line max-len
            if (getBoolForKey(UPLOAD_PHOTOS_WIFI) && networkState.type !== NetInfoStateType.wifi) {
              logGeneral.info(`Upload photos with Wifi: ${getBoolForKey(UPLOAD_PHOTOS_WIFI)}`);
              logGeneral.info(`Current network: ${networkState.type}`);
            }

            const fileName = getFileName(attachment.path);
            const filePath = `${ATTACHMENTS_FOLDER}/${fileName}`;
            const fileExists = await exists(filePath);
            if (fileExists) {
              try {
                const uploadedAttachment = await uploadReportFile(
                  accessToken,
                  attachment.event_id,
                  {
                    uri: `file://${filePath}`,
                    type: 'image/jpeg',
                    name: filePath.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_.+$/im)?.[0] || fileName || 'photo.jpg',
                  } as FileRequest,
                  reportedByData?.profileRemoteId,
                );
                // eslint-disable-next-line max-len
                await persistUploadedAttachment(uploadedAttachment?.data.id, attachment.attachment_id);
              } catch (error: any) {
                if (getApiStatus(error.message) === ApiStatus.NotFound) {
                  await updateReportAttachmentStatus(attachment.attachment_id.toString(), '-1');
                }
              }
            }
          } else {
            try {
              const uploadedAttachment = await reportCreateNote(
                accessToken,
                attachment.event_id,
                attachment.note_text,
                reportedByData?.profileRemoteId,
              );
              // eslint-disable-next-line max-len
              await persistUploadedAttachment(uploadedAttachment?.data.id, attachment.attachment_id);
            } catch (error: any) {
              if (getApiStatus(error.message) === ApiStatus.NotFound) {
                await updateReportAttachmentStatus(attachment.attachment_id.toString(), '-1');
              }
            }
          }
        }
      }

      return ApiStatus.Succeeded;
    } catch (error) {
      logSync.debug(`[${TAG}] - Could not upload event attachment - ${error}`);
      return getApiStatus(error);
    }
  }, []);

  const getFileName = (fileURI: string) => fileURI.split('/').pop() || '';

  const persistUploadedAttachment = (remoteId: string, localId: string) => {
    if (remoteId) {
      return updateReportAttachmentRemoteId([
        remoteId,
        localId,
      ]);
    }
    return null;
  };

  return { uploadReportEvents, uploadEventAttachments, uploadReportAndAttachments };
};
