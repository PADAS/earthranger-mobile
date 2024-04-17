// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { SELECT_NUMBER_OF_REPORTS_DRAFTS_PROFILE, SELECT_NUMBER_OF_REPORTS_DRAFTS_USER } from '../sql/queries';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { UserType } from '../../enums/enums';

export const useGetNumberReportDrafts = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo } = useRetrieveUser();

  const getNumberReportDrafts = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User's type info
    const userInfo = await retrieveUserInfo();

    const profileId = (userInfo && userInfo.userId !== null) ? `${userInfo.userId}` : '';

    const params = userInfo?.userType === UserType.profile ? [profileId] : [];

    if (dbInstance) {
      // Get information from the local database
      const reportDraftsCount = await retrieveData(
        dbInstance,
        userInfo?.userType === UserType.profile
          ? SELECT_NUMBER_OF_REPORTS_DRAFTS_PROFILE
          : SELECT_NUMBER_OF_REPORTS_DRAFTS_USER,
        params,
      );

      if (reportDraftsCount && reportDraftsCount.length > 0) {
        return Object.values(reportDraftsCount[0].rows.item(0))[0] as number || 0;
      }
    }

    return 0;
  }, []);

  return { getNumberReportDrafts };
};
