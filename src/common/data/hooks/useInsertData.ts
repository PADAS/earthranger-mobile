// External Dependencies
import { useCallback } from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

// Internal Dependencies
import { logSQL } from '../../utils/logUtils';

export const useInsertData = () => {
  // eslint-disable-next-line max-len
  const insertData = useCallback(async (dbInstance: SQLiteDatabase, sqlQuery: string, sqlArguments: string[]) => {
    let resultId = 0;

    await dbInstance.transaction((txn) => {
      txn.executeSql(sqlQuery, sqlArguments, (transaction, resultSet) => {
        if (resultSet.rowsAffected === 0) {
          logSQL.error('[insertData] - Information could not be saved to database');
        } else {
          resultId = resultSet.insertId;
        }
      });
    });

    return resultId;
  }, []);

  return { insertData };
};

export const useExecuteSql = () => {
  // eslint-disable-next-line max-len
  const executeSql = useCallback(async (dbInstance: SQLiteDatabase, sqlQuery: string, sqlArguments: any[]) => {
    let resultId = 0;

    await dbInstance.transaction((txn) => {
      txn.executeSql(sqlQuery, sqlArguments, (transaction, resultSet) => {
        if (resultSet.rowsAffected === 0) {
          logSQL.error('[useExecuteSql] - Information could not be saved to database');
        } else {
          resultId = resultSet.insertId;
        }
      });
    });

    return resultId;
  }, []);

  return { executeSql };
};
