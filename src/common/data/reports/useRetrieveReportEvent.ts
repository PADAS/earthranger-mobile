// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { SELECT_ATTACHMENTS_BY_ID, SELECT_EVENT_BY_ID, SELECT_EVENT_PENDING_SYNC_OR_DRAFT } from '../sql/queries';
import { DraftReports, ReportFormEvent, ReportFormEventAttachments } from '../../types/types';

export const useRetrieveReportEventById = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveReportEventById = useCallback(async (reportId: number, accountId: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const reportEventList = await retrieveData(
        dbInstance,
        SELECT_EVENT_BY_ID,
        [reportId.toString(), accountId.toString()],
      );

      return reportEventList && reportEventList.length > 0
        ? reportEventList[0].rows.item(0) as ReportFormEvent : null;
    }

    return null;
  }, []);

  return { retrieveReportEventById };
};

export const useRetrieveReportNotSyncedById = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveReportNotSyncedById = useCallback(async (reportId: number) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const event = await retrieveData(
        dbInstance,
        SELECT_EVENT_PENDING_SYNC_OR_DRAFT,
        [reportId.toString()],
      );

      let notSyncedEventItem: DraftReports | null = null;

      if (event && event[0].rows.length > 0) {
        notSyncedEventItem = event[0].rows.item(0);
      }

      return notSyncedEventItem;
    }

    return null;
  }, []);

  return { retrieveReportNotSyncedById };
};

export const useRetrieveReportAttachmentsById = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveReportAttachmentsById = useCallback(async (reportId: number, accountId: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const reportAttachmentsList = await retrieveData(
        dbInstance,
        SELECT_ATTACHMENTS_BY_ID,
        [reportId.toString(), accountId.toString()],
      );

      const attachments: ReportFormEventAttachments[] = [];

      if (reportAttachmentsList && reportAttachmentsList.length > 0) {
        for (let i = 0; i < reportAttachmentsList[0].rows.length; i++) {
          attachments.push(reportAttachmentsList[0].rows.item(i));
        }
      }

      return attachments;
    }

    return [];
  }, []);

  return { retrieveReportAttachmentsById };
};
