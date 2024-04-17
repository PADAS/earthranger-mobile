// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import {
  SELECT_PROFILE_BY_ID,
  SELECT_USER_BY_ID,
} from '../sql/queries';
import { logSQL } from '../../utils/logUtils';
import { useRetrieveData } from '../hooks/useRetrieveData';

export const useRetrieveReportedByInfo = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveUserReportedByInfo = useCallback(async (accountId: number) => {
    const reportedByData = {
      contentType: '',
      id: '',
      profileRemoteId: '',
    };

    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get current user data
      if (dbInstance && accountId) {
        const userData = await retrieveData(
          dbInstance,
          SELECT_USER_BY_ID,
          [accountId?.toString() || ''],
        );

        if (userData && userData?.length > 0) {
          reportedByData.id = userData[0].rows.item(0).subject_id.toString();
          reportedByData.contentType = userData[0].rows.item(0).content_type.toString();
        }
      }
    } catch (error) {
      logSQL.error('[retrieveUserReportedByInfo] - get user by id error:', error);
    }
    return reportedByData;
  }, []);

  const retrieveProfileReportedByInfo = useCallback(async (profileId: number) => {
    const reportedByData = {
      contentType: '',
      id: '',
      profileRemoteId: '',
    };

    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get current user data
      if (dbInstance && profileId) {
        const userData = await retrieveData(
          dbInstance,
          SELECT_PROFILE_BY_ID,
          [profileId?.toString() || ''],
        );

        if (userData && userData.length > 0) {
          reportedByData.id = userData[0].rows.item(0).subject_id.toString();
          reportedByData.contentType = userData[0].rows.item(0).content_type.toString();
          reportedByData.profileRemoteId = userData[0].rows.item(0).remote_id.toString();
        }
      }
    } catch (error) {
      logSQL.error('[retrieveProfileReportedByInfo] - get profile by id error:', error);
    }
    return reportedByData;
  }, []);

  return { retrieveProfileReportedByInfo, retrieveUserReportedByInfo };
};
