// External Dependencies
import { useCallback } from 'react';
import { enablePromise } from 'react-native-sqlite-storage';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import {
  SELECT_DEFAULT_EVENT_TYPE_FOR_PARENT_USER,
  SELECT_DEFAULT_EVENT_TYPE_BY_VALUE,
  SELECT_DEFAULT_EVENT_TYPE_FOR_PROFILE_USER,
  SELECT_EVENT_TYPE,
  SELECT_EVENT_TYPE_DISPLAY_BY_VALUE,
  SELECT_EVENT_TYPE_FOR_PARENT_USER,
  SELECT_EVENT_TYPE_FOR_PROFILE_USER,
  SELECT_EVENT_TYPE_PROFILE_BY_VALUE,
} from '../sql/queries';
import { PersistedEventType } from '../../types/types';
import { PermissionLevel, UserType } from '../../enums/enums';
import { bindQueryParams, getCategoryPermissionQueryParams } from '../../utils/dataBaseUtils';
import { logSQL } from '../../utils/logUtils';

enablePromise(true);

export const useRetrieveReportTypes = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveReportTypes = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const eventTypesList = await retrieveData(dbInstance, SELECT_EVENT_TYPE);
      const reportTypes: PersistedEventType[] = [];

      if (eventTypesList && eventTypesList.length > 0) {
        for (let i = 0; i < eventTypesList[0].rows.length; i++) {
          reportTypes.push(eventTypesList[0].rows.item(i));
        }
      }

      return reportTypes;
    }

    return [];
  }, []);

  const retrieveReportTypesByUserType = useCallback(async (
    userType: UserType,
    stringPermissions: string | null | undefined,
    profileId?: number,
  ) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    const permissionsParams = getCategoryPermissionQueryParams(
      stringPermissions,
      PermissionLevel.add,
    );

    if (dbInstance) {
      if (permissionsParams) {
        const queryParams = userType === UserType.profile
          ? [permissionsParams, `'%[${profileId},%'`, `'%,${profileId},%'`, `'%,${profileId}]%'`, `'[${profileId}]'`] : [permissionsParams];
        // Get information from the local database
        const eventTypesList = await retrieveData(
          dbInstance,
          bindQueryParams(
            userType === UserType.account && !profileId ? SELECT_EVENT_TYPE_FOR_PARENT_USER
              : SELECT_EVENT_TYPE_FOR_PROFILE_USER,
            queryParams,
          ),
          [],
        );
        const reportTypes: PersistedEventType[] = [];

        if (eventTypesList && eventTypesList.length > 0) {
          for (let i = 0; i < eventTypesList[0].rows.length; i++) {
            reportTypes.push(eventTypesList[0].rows.item(i));
          }
        }
        return reportTypes;
      }
    }

    return [];
  }, []);

  const retrieveReportTypesProfileByValue = useCallback(async (value: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database

      const eventTypesList = await retrieveData(
        dbInstance,
        SELECT_EVENT_TYPE_PROFILE_BY_VALUE,
        [value],
      );

      if (eventTypesList && eventTypesList[0].rows?.length > 0) {
        return {
          profileId: eventTypesList[0].rows.item(0).profile_id || '',
          value: eventTypesList[0].rows.item(0).value,
        };
      }

      return null;
    }

    return null;
  }, []);

  const retrieveEventTypeDisplayByValue = useCallback(async (value: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const eventTypesList = await retrieveData(
        dbInstance,
        SELECT_EVENT_TYPE_DISPLAY_BY_VALUE,
        [value],
      );

      if (eventTypesList && eventTypesList[0].rows?.length > 0) {
        return eventTypesList[0].rows.item(0).display;
      }

      return null;
    }

    return null;
  }, []);

  const retrieveDefaultEventTypeByValue = useCallback(async (value: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database

      const eventTypesList = await retrieveData(
        dbInstance,
        SELECT_DEFAULT_EVENT_TYPE_BY_VALUE,
        [value],
      );

      if (eventTypesList && eventTypesList[0].rows?.length > 0) {
        return eventTypesList[0].rows.item(0);
      }

      return null;
    }

    return null;
  }, []);

  const retrieveDefaultEventType = useCallback(async (
    userType: UserType,
    profileId?: string,
  ) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        // Get information from the local database

        const defaultEventType = await retrieveData(
          dbInstance,
          userType === UserType.account && !profileId
            ? SELECT_DEFAULT_EVENT_TYPE_FOR_PARENT_USER
            : SELECT_DEFAULT_EVENT_TYPE_FOR_PROFILE_USER,
          userType === UserType.account && !profileId
            ? []
            : [`%[${profileId},%`, `%,${profileId},%`, `%,${profileId}]%`, `[${profileId}]`],
        );
        if (defaultEventType && defaultEventType[0].rows?.length > 0) {
          return {
            defaultEventTypeDisplay: defaultEventType[0].rows.item(0).display || '',
            defaultEventTypeValue: defaultEventType[0].rows.item(0).value || '',
          };
        }

        return null;
      }
    } catch (error) {
      logSQL.error('[retrieveDefaultEventType] - get defaultEventType ', error);
    }

    return null;
  }, []);

  return {
    retrieveReportTypes,
    retrieveReportTypesByUserType,
    retrieveReportTypesProfileByValue,
    retrieveDefaultEventType,
    retrieveEventTypeDisplayByValue,
    retrieveDefaultEventTypeByValue,
  };
};
