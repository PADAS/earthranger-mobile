// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { EventType } from '../../types/reportsResponse';
import { useGetDBConnection } from '../PersistentStore';
import { SELECT_EVENT_TYPES_BY_CATEGORY_AND_DISPLAY, SELECT_EVENT_TYPES_BY_DISPLAY_PROFILE, SELECT_EVENT_TYPES_BY_DISPLAY_USER } from '../sql/queries';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { PermissionLevel, UserType } from '../../enums/enums';
import { bindQueryParams, getCategoryPermissionQueryParams } from '../../utils/dataBaseUtils';

enablePromise(true);

export const useFilterReportTypesByDisplay = () => {
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo } = useRetrieveUser();

  /**
   * Form for user login
   * @param {array} sqlParams first index is category_id, second index is display to search
   * @param {boolean} mergeCategories switch between filter by category_id & display
   * and filter by display only
   */
  const filterReportTypesByDisplay = useCallback(async (
    sqlParams: string[],
    mergeCategories: boolean,
    queryText: string,
  ) => {
    // Constants
    const userInfo = await retrieveUserInfo();
    const permissionsParams = getCategoryPermissionQueryParams(
      userInfo?.permissions,
      PermissionLevel.add,
    );
    let query = SELECT_EVENT_TYPES_BY_DISPLAY_USER;
    let mergeCategoriesParams: any[] = [permissionsParams];

    if (mergeCategories) {
      let profileId;
      if (userInfo) {
        if (userInfo.userType === UserType.profile) {
          profileId = parseInt(userInfo.userId || '', 10);
          query = SELECT_EVENT_TYPES_BY_DISPLAY_PROFILE;
          mergeCategoriesParams = [permissionsParams, `'%${queryText}%'`, `'%[${profileId},%'`, `'%,${profileId},%'`, `'%,${profileId}]%'`, `'[${profileId}]'`];
        } else {
          mergeCategoriesParams.push(`'%${queryText}%'`);
        }
      }
    }
    const dbInstance = await getDBInstance();
    if (dbInstance) {
      const eventTypesList = await retrieveData(
        dbInstance,
        // eslint-disable-next-line no-nested-ternary
        mergeCategories
          ? bindQueryParams(query, mergeCategoriesParams)
          : SELECT_EVENT_TYPES_BY_CATEGORY_AND_DISPLAY,
        mergeCategories ? [] : sqlParams,
      );
      const reportTypes: EventType[] = [];

      if (eventTypesList && eventTypesList.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < eventTypesList[0].rows.length; i++) {
          reportTypes.push(eventTypesList[0].rows.item(i));
        }
      }

      return reportTypes;
    }

    return [];
  }, []);

  return { filterReportTypesByDisplay };
};
