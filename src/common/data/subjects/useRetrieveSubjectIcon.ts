// External Dependencies
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useCallback } from 'react';

// Internal Dependencies
import { logSQL } from '../../utils/logUtils';
import { SELECT_SUBJECT_ICON } from '../sql/subjectQueries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';

export const useRetrieveSubjectIcon = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveSubjectIcon = useCallback(async (remoteId: string): Promise<string | null> => {
    let dbInstance: SQLiteDatabase | null = null;
    let subjectIcon: string | null = null;

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
      try {
        // eslint-disable-next-line no-await-in-loop
        const subjectIconRaw = await retrieveData(
          dbInstance,
          SELECT_SUBJECT_ICON,
          [remoteId],
        );

        if (subjectIconRaw && subjectIconRaw[0].rows.length === 1) {
          subjectIcon = subjectIconRaw[0].rows.item(0).icon_svg;
        }
      } catch (error) {
        logSQL.error('Subject icon not retrieved from local database. Error ->', error);

        if (error instanceof Error) {
          throw Error(error.message);
        } else if (typeof error === 'string') {
          throw Error(error);
        }
      }
    }

    return subjectIcon;
  }, []);

  return { retrieveSubjectIcon };
};
