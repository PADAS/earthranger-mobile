// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { Category, EventCategory } from '../../types/reportsResponse';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import {
  SELECT_EVENT_CATEGORIES_FOR_PARENT_USER,
  SELECT_EVENT_CATEGORIES_FOR_PROFILE_USER,
  SELECT_EVENT_CATEGORY_BY_VALUE,
  SELECT_EVENT_CATEGORY_FILTER_EMPTY_TYPE,
} from '../sql/queries';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import { UserType } from '../../enums/enums';
import { logSQL } from '../../utils/logUtils';

enablePromise(true);

export const useRetrieveReportCategories = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveReportCategories = useCallback(async () => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        // Get information from the local database
        const eventCategoriesList = await
        retrieveData(dbInstance, SELECT_EVENT_CATEGORY_FILTER_EMPTY_TYPE, [getSecuredStringForKey(USER_ID_KEY) || '']);
        const reportCategories: EventCategory[] = [];

        if (eventCategoriesList && eventCategoriesList.length > 0) {
          for (let i = 0; i < eventCategoriesList[0].rows.length; i++) {
            reportCategories.push(eventCategoriesList[0].rows.item(i));
          }
        }

        return reportCategories;
      }
    } catch (error) {
      logSQL.error('[retrieveReportCategories] - get reportCategories ', error);
    }

    return [];
  }, []);

  // eslint-disable-next-line max-len
  const retrieveReportCategory = useCallback(async (eventCategoryValue: string): Promise<Category | null> => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const eventCategory = await
      retrieveData(dbInstance, SELECT_EVENT_CATEGORY_BY_VALUE, [eventCategoryValue]);

      if (eventCategory && eventCategory.length > 0 && eventCategory[0].rows.length > 0) {
        const eventCategoryItem = eventCategory[0].rows.item(0);
        return {
          id: eventCategoryItem.id,
          value: eventCategoryItem.value,
          display: eventCategoryItem.display,
          ordernum: eventCategoryItem.ordernum,
          account_id: eventCategoryItem.account_id,
          profile_id: JSON.parse(eventCategoryItem.profile_id),
        };
      }
    }

    return null;
  }, []);

  const retrieveReportCategoriesByUserType = useCallback(async (
    userType: UserType,
    profileId?: number,
  ) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const eventCategories = await retrieveData(
        dbInstance,
        userType === UserType.account && !profileId
          ? SELECT_EVENT_CATEGORIES_FOR_PARENT_USER
          : SELECT_EVENT_CATEGORIES_FOR_PROFILE_USER,
        userType === UserType.account && !profileId
          ? []
          : [`%[${profileId},%`, `%,${profileId},%`, `%,${profileId}]%`, `[${profileId}]`],
      );

      if (eventCategories && eventCategories.length > 0 && eventCategories[0].rows.length > 0) {
        const eventCategoriesList: EventCategory[] = [];

        for (let i = 0; i < eventCategories[0].rows.length; i++) {
          eventCategoriesList.push(eventCategories[0].rows.item(i));
        }

        return eventCategoriesList;
      }
    }

    return [];
  }, []);

  return {
    retrieveReportCategories,
    retrieveReportCategory,
    retrieveReportCategoriesByUserType,
  };
};
