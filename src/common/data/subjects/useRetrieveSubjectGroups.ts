// External Dependencies
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useCallback } from 'react';

// Internal Dependencies
import { logSQL } from '../../utils/logUtils';
import {
  SELECT_PARENT_SUBJECT_GROUPS,
  SELECT_PROFILE_PARENT_SUBJECT_GROUPS,
  SELECT_PROFILE_SUBJECT_GROUPS,
  SELECT_SUBJECTS_BY_SUBJECT_GROUP,
  SELECT_SUBJECT_GROUPS,
} from '../sql/subjectQueries';
import { Subject, SubjectGroupData } from '../../types/types';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';

export const useRetrieveSubjectGroups = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveSubjectGroups = useCallback(async (
    isParentView: boolean,
    parentId: string,
    profileId?: number,
  ): Promise<(SubjectGroupData | Subject)[]> => {
    let dbInstance: SQLiteDatabase | null = null;
    const subjectGroups: (SubjectGroupData | Subject)[] = [];
    try {
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
        let query: string;
        let params: any[];

        if (profileId && profileId !== undefined) {
          if (!isParentView && parentId) {
            query = SELECT_PROFILE_SUBJECT_GROUPS;
            params = [parentId, profileId];
          } else {
            query = SELECT_PROFILE_PARENT_SUBJECT_GROUPS;
            params = [profileId];
          }
        } else if (!isParentView && parentId) {
          query = SELECT_SUBJECT_GROUPS;
          params = [parentId];
        } else {
          query = SELECT_PARENT_SUBJECT_GROUPS;
          params = [];
        }

        const subjectGroupsRaw = await retrieveData(dbInstance, query, params);

        if (subjectGroupsRaw && subjectGroupsRaw[0].rows.length > 0) {
          for (let i = 0, l = subjectGroupsRaw[0].rows.length; i < l; i++) {
            const item = subjectGroupsRaw[0].rows.item(i);
            const subjectGroupItem: SubjectGroupData = {
              count: 0,
              isVisible: true,
              title: item.name,
              type: 'group',
              subjects: [],
              id: item.id.toString(),
            };
            subjectGroups.push(subjectGroupItem);

            // eslint-disable-next-line no-await-in-loop
            const subjectsRaw = await retrieveData(
              dbInstance,
              SELECT_SUBJECTS_BY_SUBJECT_GROUP,
              [item.id.toString()],
            );
            if (subjectsRaw && subjectsRaw[0].rows.length > 0) {
              subjectGroupItem.count = subjectsRaw[0].rows.length;
            }
          }
        }

        if (parentId) {
          try {
            const subjectsRaw = await retrieveData(
              dbInstance,
              SELECT_SUBJECTS_BY_SUBJECT_GROUP,
              [parentId],
            );
            if (subjectsRaw && subjectsRaw[0].rows.length > 0) {
              for (let j = 0, k = subjectsRaw[0].rows.length; j < k; j++) {
                const subjectItem = subjectsRaw[0].rows.item(j);
                const subject: Subject = {
                  id: subjectItem.remote_id,
                  name: subjectItem.name,
                  type: 'subject',
                  isHidden: false,
                  isVisible: true,
                  icon: subjectItem.icon_svg,
                  lastPosition: subjectItem.last_position,
                  lastPositionUpdate: subjectItem.last_position_date,
                };
                subjectGroups.push(subject);
              }
            }
          } catch (error) {
            logSQL.error('Subjects for subject group not retrieved from local database. Error ->', error);
          }
        }
      } catch (error) {
        logSQL.error('Subject Groups not retrieved from local database. Error ->', error);
        if (error instanceof Error) {
          throw Error(error.message);
        } else if (typeof error === 'string') {
          throw Error(error);
        }
      }
    }
    return subjectGroups;
  }, []);

  return { retrieveSubjectGroups };
};
