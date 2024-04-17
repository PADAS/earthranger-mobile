// External Dependencies
import { useCallback } from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { logSQL } from '../../utils/logUtils';

export const useRetrieveData = () => {
  // eslint-disable-next-line max-len
  const retrieveData = useCallback(async (dbInstance: SQLiteDatabase, sqlQuery: string, sqlParams?: string[]) => {
    let results = null;
    try {
      results = await dbInstance.executeSql(sqlQuery, sqlParams || undefined);
    } catch (error) {
      logSQL.error('[retrieveData] - Could not get data', error);
    }

    return results;
  }, []);

  return { retrieveData };
};
