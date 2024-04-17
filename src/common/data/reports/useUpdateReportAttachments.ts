// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import {
  DELETE_ATTACHMENT_NOTE,
  INSERT_ATTACHMENT,
  UPDATE_ATTACHMENT_NOTE,
  UPDATE_ATTACHMENT_UPLOAD,
} from '../sql/queries';
import { logSync } from '../../utils/logUtils';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import {
  AttachmentUpdateNoteType, AttachmentAddNewNoteType, AttachmentDeleteNoteType, AttachmentPhotoType,
} from '../../types/types';
import { Note } from '../../types/reportsResponse';
import { useRetrieveData } from '../hooks/useRetrieveData';

// Interfaces + Types
type ImageAttachments = {
  type: AttachmentPhotoType,
  attachments: {
    images: string[],
    thumbnails: string[],
  },
  eventId: number
};
type NoteAttachments = {
  type: AttachmentUpdateNoteType | AttachmentAddNewNoteType | AttachmentDeleteNoteType,
  attachments: Note[],
  eventId: number
};
type ReportAttachmentsProps = ImageAttachments | NoteAttachments;

export const useUpdateReportAttachments = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveData } = useRetrieveData();

  const updateReportAttachments = useCallback(async ({
    type,
    attachments,
    eventId,
  }: ReportAttachmentsProps) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        if (type === 'photo') {
          const { thumbnails, images } = attachments;
          for (let i = 0, l = thumbnails.length; i < l; i++) {
            const queryArguments = [
              accountId.toString(),
              eventId.toString(),
              'photo',
              images[i],
              thumbnails[i],
              '', // Notes are empty for images
              '0', // will change on upload
            ];
            // eslint-disable-next-line no-await-in-loop
            await insertData(dbInstance, INSERT_ATTACHMENT, queryArguments);
          }
        } else if (type === 'updateNote') {
          const notes: Note[] = attachments;
          for (let i = 0, l = notes.length; i < l; i++) {
            const queryArguments = [
              notes[i].text,
              notes[i].id.toString(),
            ];
            // eslint-disable-next-line no-await-in-loop
            await insertData(dbInstance, UPDATE_ATTACHMENT_NOTE, queryArguments);
          }
        } else if (type === 'addNewNote') {
          const notes: Note[] = attachments;
          for (let i = 0, l = notes.length; i < l; i++) {
            const queryArguments = [
              accountId.toString(),
              eventId.toString(),
              'note',
              '', // Image is empty for notes
              '', // Thumbnail is empty for notes
              notes[i].text,
              '0', // will change on upload
            ];
            // eslint-disable-next-line no-await-in-loop
            await insertData(dbInstance, INSERT_ATTACHMENT, queryArguments);
          }
        } else if (type === 'deleteNote') {
          const notes: Note[] = attachments;
          for (let i = 0, l = notes.length; i < l; i++) {
            const queryArguments = [
              notes[i].id.toString(),
            ];
            // eslint-disable-next-line no-await-in-loop
            await retrieveData(dbInstance, DELETE_ATTACHMENT_NOTE, queryArguments);
          }
        }
      }
    } catch (error) {
      logSync.error('[Reports] - updateReportAttachments: error', error);
    }
  }, []);

  const updateReportAttachmentStatus = useCallback(async (attachmentId: string, status: string) => {
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Update information in the local database
      await insertData(
        dbInstance,
        UPDATE_ATTACHMENT_UPLOAD,
        [status, attachmentId],
      );
    }
  }, []);

  return {
    updateReportAttachments,
    updateReportAttachmentStatus,
  };
};
