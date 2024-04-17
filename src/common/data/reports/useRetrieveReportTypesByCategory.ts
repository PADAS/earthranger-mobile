// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { EventType } from '../../types/reportsResponse';
import { useGetDBConnection } from '../PersistentStore';
import { SELECT_EVENT_TYPES_BY_CATEGORY } from '../sql/queries';
import { useRetrieveData } from '../hooks/useRetrieveData';

enablePromise(true);

export const useRetrieveReportTypesByCategory = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveReportTypesByCategory = useCallback(async (sqlParams: string[]) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const eventTypesList = await retrieveData(
        dbInstance,
        SELECT_EVENT_TYPES_BY_CATEGORY,
        sqlParams,
      );
      const reportTypes: EventType[] = [];

      if (eventTypesList && eventTypesList.length > 0) {
        for (let i = 0; i < eventTypesList[0].rows.length; i++) {
          reportTypes.push(eventTypesList[0].rows.item(i));
        }
      }

      return reportTypes;
    }

    return [];
  }, []);

  return { retrieveReportTypesByCategory };
};
