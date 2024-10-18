// External Dependencies
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useCallback } from 'react';

// Internal Dependencies
import { logSQL } from '../../utils/logUtils';
import { SELECT_SUBJECTS, SELECT_SUBJECT_GROUP_BY_REMOTE_ID } from '../sql/subjectQueries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { SubjectGroup } from '../../types/subjectsResponse';

export const useRetrieveSubjects = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const handleError = (error: unknown): never => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  };

  const extractSubjects = (subjectsRaw: any): string[] => {
    if (!subjectsRaw || !subjectsRaw[0]?.rows?.length) return [];
    return Array.from({ length: subjectsRaw[0].rows.length }, (_, i) => subjectsRaw[0].rows.item(i).remote_id);
  };

  const retrieveLocalSubjectGroupIds = useCallback(async (subjectGroups: SubjectGroup[]): Promise<number[]> => {
    const remoteIds = subjectGroups.map((group) => group.id);
    const localIds: number[] = [];

    let dbInstance: SQLiteDatabase | null = null;

    try {
      dbInstance = await getDBInstance();
      if (dbInstance) {
        // eslint-disable-next-line no-restricted-syntax
        for (const remoteId of remoteIds) {
          // eslint-disable-next-line no-await-in-loop
          const groupIds = await retrieveData(
            dbInstance,
            SELECT_SUBJECT_GROUP_BY_REMOTE_ID,
            [remoteId],
          );

          if (groupIds && groupIds[0].rows.length === 1) {
            const localId = groupIds[0].rows.item(0).id;
            localIds.push(localId);
          }
        }
      }
    } catch (error) {
      logSQL.error('Subject id list not retrieved from local database. Error ->', error);
      return handleError(error);
    }

    return localIds;
  }, []);

  const retrieveSubjects = useCallback(async (): Promise<string[]> => {
    let dbInstance: SQLiteDatabase | null = null;
    try {
      dbInstance = await getDBInstance();
      if (!dbInstance) return [];
      const subjectsRaw = await retrieveData(dbInstance, SELECT_SUBJECTS, []);
      return extractSubjects(subjectsRaw);
    } catch (error) {
      logSQL.error('Subject remote_id list not retrieved from local database. Error ->', error);
      return handleError(error);
    }
  }, []);

  return { retrieveLocalSubjectGroupIds, retrieveSubjects };
};
