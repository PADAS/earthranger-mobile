// External Dependencies
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useCallback } from 'react';

// Internal Dependencies
import { INSERT_PROFILE_SUBJECT_GROUPS, INSERT_SUBJECT_GROUPS } from '../sql/subjectQueries';
import { logSQL } from '../../utils/logUtils';
import { SubjectGroup } from '../../types/subjectsResponse';
import { useGetDBConnection } from '../PersistentStore';
import { useExecuteSql, useInsertData } from '../hooks/useInsertData';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import { usePopulateSubjects } from './usePopulateSubjects';

export const usePopulateSubjectGroups = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { executeSql } = useExecuteSql();
  const { populateSubjects } = usePopulateSubjects();

  const populateProfileSubjectGroups = useCallback(async (
    profileId: number,
    subjectGroupIds: number[],
  ): Promise<void> => {
    let dbInstance: SQLiteDatabase | null = null;

    try {
      dbInstance = await getDBInstance();
      if (dbInstance) {
        // eslint-disable-next-line no-restricted-syntax
        for (const groupId of subjectGroupIds) {
          // eslint-disable-next-line no-await-in-loop
          await executeSql(dbInstance, INSERT_PROFILE_SUBJECT_GROUPS, [
            profileId,
            groupId,
          ]);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw Error(error.message);
      } else if (typeof error === 'string') {
        throw Error(error);
      }
    }
  }, []);

  const populateSubjectGroups = useCallback(async (
    subjectGroups: SubjectGroup[],
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

    // Get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    if (dbInstance) {
      await traverseTree(dbInstance, subjectGroups, accountId);
    }
  }, []);

  const traverseTree = useCallback(async (
    dbInstance: SQLiteDatabase,
    subjectGroups: SubjectGroup[],
    accountId: string,
    parentSubjectGroupId?: number,
  ) => {
    for (let i = 0, l = subjectGroups.length; i < l; i++) {
      const item = subjectGroups[i];

      // eslint-disable-next-line no-await-in-loop
      const subjectGroupId = await populateData(
        dbInstance,
        item,
        accountId,
        parentSubjectGroupId || null,
      );

      if (item.subgroups.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await traverseTree(
          dbInstance,
          item.subgroups,
          accountId,
          subjectGroupId || undefined,
        );
      }

      if (item.subjects.length > 0 && subjectGroupId) {
        // eslint-disable-next-line no-await-in-loop
        await populateSubjects(item.subjects, subjectGroupId.toString());
      }
    }
  }, []);

  const populateData = useCallback(async (
    dbInstance: SQLiteDatabase,
    subjectGroup: SubjectGroup,
    accountId: string,
    parentGroupId: number | null,
  ) => {
    let subjectGroupId = null;
    try {
      // eslint-disable-next-line no-await-in-loop
      subjectGroupId = await insertData(
        dbInstance,
        INSERT_SUBJECT_GROUPS,
        parentGroupId
          ? [subjectGroup.id, accountId, subjectGroup.name, parentGroupId.toString()]
          : [subjectGroup.id, accountId, subjectGroup.name],
      );
    } catch (error) {
      logSQL.error('Subject Groups not inserted into local database. Error ->', error);

      if (error instanceof Error) {
        throw Error(error.message);
      } else if (typeof error === 'string') {
        throw Error(error);
      }
    }

    return subjectGroupId;
  }, []);

  return { populateProfileSubjectGroups, populateSubjectGroups };
};
