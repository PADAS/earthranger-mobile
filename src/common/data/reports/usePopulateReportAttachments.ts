// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { INSERT_ATTACHMENT } from '../sql/queries';
import log from '../../utils/logUtils';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import { AttachmentNoteType, AttachmentPhotoType } from '../../types/types';
import { Note } from '../../types/reportsResponse';

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
  type: AttachmentNoteType,
  attachments: Note[],
  eventId: number
};
type ReportAttachmentsProps = ImageAttachments | NoteAttachments;

export const usePopulateReportAttachments = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();

  const populateReportAttachments = useCallback(async ({
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
        } else if (type === 'note') {
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
        }
      }
    } catch {
      log.error('[Reports] - populateReportAttachments: error');
    }
  }, []);

  return { populateReportAttachments };
};
