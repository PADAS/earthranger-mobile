/* eslint-disable quote-props */
// External Dependencies
import { useCallback } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { UserType, EventStatus, PermissionLevel } from '../../enums/enums';
import {
  SELECT_ATTACHMENTS_BY_ID,
  SELECT_EVENTS_FOR_PARENT_USER,
  SELECT_EVENTS_FOR_PROFILE_USER,
} from '../sql/queries';
import { getBoolForKey } from '../storage/keyValue';
import {
  IS_STATUS_FILTER_DRAFT_SELECTED,
  IS_STATUS_FILTER_PENDING_SELECTED,
  IS_STATUS_FILTER_SYNCED_SELECTED,
  USER_ID_KEY,
} from '../../constants/constants';
import { COLORS_LIGHT } from '../../constants/colors';
import { EventListItem } from '../../types/types';
import { bindQueryParams, getCategoryPermissionQueryParams } from '../../utils/dataBaseUtils';
import { getSecuredStringForKey } from '../storage/utils';

export const useRetrieveReports = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo } = useRetrieveUser();
  const { t } = useTranslation();

  const statusFiltersPermutations: { [key: string]: string } = {
    '000': '?',
    '100': '? AND events.is_draft = 1',
    '010': '? AND events.is_draft = 0 AND (events.remote_id IS NULL OR (SELECT COUNT(attachments.id) - COUNT(attachments.remote_id) AS pendingSync FROM attachments WHERE event_id = events.id) != 0)',
    '001': '? AND events.is_draft = 0 AND (events.remote_id IS NOT NULL) AND (SELECT COUNT(attachments.id) - COUNT(attachments.remote_id) AS pendingSync FROM attachments WHERE event_id = events.id) = 0',
    '110': '? AND (events.is_draft = 1 OR (events.is_draft = 0 AND (events.remote_id IS NULL OR (SELECT COUNT(attachments.id) - COUNT(attachments.remote_id) AS pendingSync FROM attachments WHERE event_id = events.id) != 0)))',
    '011': '? AND (events.is_draft = 0)',
    '101': '? AND (events.is_draft = 1 OR (events.is_draft = 0 AND (events.remote_id IS NOT NULL) AND (SELECT COUNT(attachments.id) - COUNT(attachments.remote_id) AS pendingSync FROM attachments WHERE event_id = events.id) = 0))',
    '111': '?',
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusFiltersQuery = (type: UserType, profileId?: string) => {
    const isDraftsSelected = Number(getBoolForKey(IS_STATUS_FILTER_DRAFT_SELECTED));
    const isPendingSyncSelected = Number(getBoolForKey(IS_STATUS_FILTER_PENDING_SELECTED));
    const isSyncedSelected = Number(getBoolForKey(IS_STATUS_FILTER_SYNCED_SELECTED));
    const key = `${isDraftsSelected}${isPendingSyncSelected}${isSyncedSelected}`;

    if (type === UserType.profile) {
      const query = bindQueryParams(statusFiltersPermutations[key], ['events.profile_id = ?']);
      return bindQueryParams(query, [profileId]);
    }

    return bindQueryParams(statusFiltersPermutations[key], ['(events.account_id IS NOT NULL AND events.profile_id IS NULL)']);
  };

  const formatEventUploadPendingDetails = (status: any) => {
    const pending = [];

    if (!status.isReportUploaded) {
      pending.push(t('common.report'));
    }

    // Pending Images
    if (status.pending.images > 0) {
      const text = `${status.pending.images} ${status.pending.images === 1 ? t('common.image') : t('common.images')}`;
      pending.push(text);
    }

    // Pending Notes
    if (status.pending.notes > 0) {
      const text = `${status.pending.notes} ${status.pending.notes === 1 ? t('common.note') : t('common.notes')}`;
      pending.push(text);
    }

    return {
      pending,
    };
  };

  const retrieveReports = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    const userInfo = await retrieveUserInfo();

    if (dbInstance) {
      const reportsLocalList: EventListItem[] = [];

      const profileId = userInfo && userInfo.userId ? `${userInfo.userId}` : '';

      const permissionsParams = getCategoryPermissionQueryParams(
        userInfo?.permissions,
        PermissionLevel.view,
      );

      if (permissionsParams) {
        const queryParams = userInfo?.userType === UserType.profile
          ? [
            permissionsParams,
            getStatusFiltersQuery(UserType.profile, profileId),
          ] : [
            permissionsParams,
            getStatusFiltersQuery(UserType.account),
          ];

        // Get information from the local database
        const reportsList = await retrieveData(
          dbInstance,
          bindQueryParams(userInfo?.userType === UserType.profile
            ? SELECT_EVENTS_FOR_PROFILE_USER : SELECT_EVENTS_FOR_PARENT_USER, queryParams),
          [],
        );

        if (reportsList && reportsList[0].rows.length > 0) {
          for (let i = 0, l = reportsList[0].rows.length; i < l; i++) {
            const reportItem = reportsList[0].rows.item(i);

            let status = null;
            let bgColor = null;
            let fgColor = null;
            let statusIcon = null;
            let labelText = null;
            let text = null;
            const attachmentsStatus = {
              pending: {
                images: 0,
                notes: 0,
              },
              isReportUploaded: reportItem.remote_id,
            };

            // eslint-disable-next-line no-await-in-loop
            const attachments = await retrieveData(
              dbInstance,
              SELECT_ATTACHMENTS_BY_ID,
              [reportItem.id.toString(), getSecuredStringForKey(USER_ID_KEY) || ''],
            );

            if (attachments && attachments[0].rows.length > 0) {
              let pendingNotes = 0;
              let pendingImages = 0;

              for (let j = 0; j < attachments[0].rows.length; j++) {
                if (attachments[0].rows.item(j).type === 'note' && attachments[0].rows.item(j).uploaded === 0) {
                  pendingNotes += 1;
                } else if (attachments[0].rows.item(j).type === 'photo' && attachments[0].rows.item(j).uploaded === 0) {
                  pendingImages += 1;
                }
              }

              attachmentsStatus.pending.images = pendingImages;
              attachmentsStatus.pending.notes = pendingNotes;
            }

            if (reportItem.is_draft === 1) {
              status = EventStatus.draft;
              bgColor = COLORS_LIGHT.blueLight;
              fgColor = COLORS_LIGHT.brightBlue;
              statusIcon = 'editIcon';
              labelText = t('reports.statusList.draft');
              text = `${t('reports.statusDetails.edited')} ${dayjs(reportItem.created_at).format('YYYY MMM D, HH:mm')}`;
            } else if (reportItem.state) {
              status = EventStatus.error;
              bgColor = '#FDF2F4';
              fgColor = COLORS_LIGHT.red;
              statusIcon = 'errorIcon';
              labelText = t('reports.statusList.error');
              text = t('reports.statusDetails.error');
            } else if (
              reportItem.remote_id
              && attachmentsStatus.pending.images === 0
              && attachmentsStatus.pending.notes === 0
            ) {
              status = EventStatus.submitted;
              bgColor = '#F5F7F3';
              fgColor = '#3B6211';
              statusIcon = 'submittedIcon';
              labelText = t('reports.statusList.synced');
              text = `${t('reports.statusDetails.submitted')} ${dayjs(reportItem.created_at).format('YYYY MMM D, HH:mm')}`;
            } else {
              status = EventStatus.pendingSync;
              bgColor = COLORS_LIGHT.G6_LightGreyButton;
              fgColor = COLORS_LIGHT.G0_black;
              labelText = t('reports.statusList.pendingSync');
              statusIcon = 'pendingSyncIcon';
              text = `${formatEventUploadPendingDetails(attachmentsStatus).pending.join(', ')}`;
            }

            reportsLocalList.push({
              bgColor,
              defaultPriority: reportItem.default_priority,
              error: reportItem.state,
              fgColor,
              hidden: false,
              icon: reportItem.icon_svg,
              id: reportItem.id,
              isDraft: reportItem.is_draft,
              labelText,
              remoteId: reportItem.remote_id,
              status,
              statusIcon,
              text,
              title: reportItem.title,
            });
          }
        }
      }
      return reportsLocalList;
    }

    return null;
  }, []);

  return { retrieveReports };
};
