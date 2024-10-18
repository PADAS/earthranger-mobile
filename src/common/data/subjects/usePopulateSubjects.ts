// External Dependencies
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useCallback } from 'react';

// Internal Dependencies
import { INSERT_SUBJECT, INSERT_SUBJECT_GROUP_MEMBERSHIP, SELECT_SUBJECT_BY_REMOTE_ID } from '../sql/subjectQueries';
import { logSQL } from '../../utils/logUtils';
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { Subject } from '../../types/subjectsResponse';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { getIconSVGMarkup } from '../../utils/iconsUtils';
import { cleanUpSvg } from '../../utils/svgIconsUtils';

export const usePopulateSubjects = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveData } = useRetrieveData();

  const populateSubjects = useCallback(async (
    subjects: Subject[],
    subjectGroupId: string,
  ): Promise<void> => {
    let dbInstance: SQLiteDatabase | null = null;

    try {
      // Get database connection instance
      dbInstance = await getDBInstance();
    } catch (error) {
      if (error instanceof Error) {
        throw Error(error.message);
      } else if (typeof error === 'string') {
        throw Error(error);
      }
    }

    if (dbInstance) {
      for (let i = 0, l = subjects.length; i < l; i++) {
        const subject = subjects[i];

        try {
          let subjectId = 0;

          // eslint-disable-next-line no-await-in-loop
          const existingSubject = await retrieveData(
            dbInstance,
            SELECT_SUBJECT_BY_REMOTE_ID,
            [subject.id],
          );

          if (existingSubject && existingSubject[0].rows && existingSubject[0].rows.length > 0) {
            subjectId = existingSubject[0].rows.item(0).id;
          } else {
            // eslint-disable-next-line no-await-in-loop
            const iconSVG = await getIconSVGMarkup(subject.image_url) || '';
            let xml = '';
            if (iconSVG) {
              xml = cleanUpSvg(iconSVG);
            }

            // eslint-disable-next-line no-await-in-loop
            subjectId = await insertData(
              dbInstance,
              INSERT_SUBJECT,
              [
                subject.id,
                subject.name,
                subject.is_active ? '1' : '0',
                xml,
                subject.tracks_available ? '1' : '0',
                JSON.stringify(subject.last_position),
                subject.last_position_date,
                subject.updated_at,
              ],
            );
          }

          if (subjectId !== 0) {
            // eslint-disable-next-line no-await-in-loop
            await insertData(
              dbInstance,
              INSERT_SUBJECT_GROUP_MEMBERSHIP,
              [
                subjectGroupId,
                subjectId.toString(),
              ],
            );
          }
        } catch (error) {
          logSQL.error('Subject not inserted into local database. Error ->', error);

          if (error instanceof Error) {
            throw Error(error.message);
          } else if (typeof error === 'string') {
            throw Error(error);
          }
        }
      }
    }
  }, []);

  return { populateSubjects };
};
