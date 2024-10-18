/* eslint-disable no-await-in-loop */
// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import {
  getReportTypeIcon,
  getReportTypes,
  getReportTypeSchema,
  isReportTypeVisible,
  parseToActiveUserArray,
  parseToProfileArray,
} from '../../../api/reportsAPI';
import { useGetDBConnection } from '../PersistentStore';
import { useExecuteSql } from '../hooks/useInsertData';
import {
  INSERT_EVENT_TYPE,
  UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE,
  UPSERT_EVENT_TYPE_PROFILE,
  UPSERT_EVENT_TYPE_USER,
} from '../sql/queries';
import { logSQL } from '../../utils/logUtils';
import { getSecuredStringForKey } from '../storage/utils';
import { USER_ID_KEY } from '../../constants/constants';
import { Type } from '../../types/reportsResponse';
import { useRetrieveUserProfiles } from '../users/useRetrieveUserProfiles';
import { useRetrieveReportTypes } from './useRetrieveReportTypes';
import { PermissionLevel, UserType } from '../../enums/enums';
import { UserInfo } from '../../types/types';
import { hasEventCategoryAccess } from '../../utils/permissionsUtils';

export const usePopulateReportTypes = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { executeSql } = useExecuteSql();
  const { retrieveUserProfilesRemoteID } = useRetrieveUserProfiles();
  const { retrieveReportTypesProfileByValue } = useRetrieveReportTypes();

  const populateReportTypes = useCallback(async (accessToken: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Fetch information from remote database
      const reportTypeResponse = await getReportTypes(accessToken);

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        // eslint-disable-next-line no-restricted-syntax
        for (const type of reportTypeResponse.data) {
          if (isReportTypeVisible(type)) {
            try {
              const icon = await getReportTypeIcon(type.icon_id) || '';
              const schema = await getReportTypeSchema(accessToken, type.value);
              const typeArray = parseToProfileArray(
                type,
                accountId,
                undefined,
                icon,
                JSON.stringify(schema.data || ''),
              );
              await executeSql(dbInstance, INSERT_EVENT_TYPE, typeArray);
            } catch (error) {
              logSQL.error(`Report type ${type.value} could not be inserted into the local database`, error);
            }
          }
        }
      }
      logSQL.debug('event_type table updated');
    } catch (error) {
      logSQL.error('[usePopulateReportTypes] - getReportTypes: error', error);
    }
  }, []);

  const populateProfileReportTypes = useCallback(async (accessToken: string) => {
    try {
      // Fetch user profiles in local database
      const userProfiles = await retrieveUserProfilesRemoteID();

      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        // eslint-disable-next-line no-restricted-syntax
        for (const profile of userProfiles) {
          // Fetch information from remote database
          const reportTypeResponse = await getReportTypes(accessToken, profile.remote_id);

          // eslint-disable-next-line no-restricted-syntax
          for (const type of reportTypeResponse.data) {
            if (
              isReportTypeVisible(type)
              // eslint-disable-next-line max-len
              && hasEventCategoryAccess(profile.permissions, type.category.value, PermissionLevel.add)
            ) {
              try {
                const persistedReportType = await retrieveReportTypesProfileByValue(type.value);
                if (persistedReportType) {
                  const profiles = appendArrayProfileId(profile.id, persistedReportType?.profileId);
                  await executeSql(dbInstance, UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE, [
                    JSON.stringify(profiles),
                    persistedReportType.value,
                  ]);
                } else {
                  const icon = await getReportTypeIcon(type.icon_id) || '';
                  const schema = await getReportTypeSchema(accessToken, type.value);
                  const typeArray = parseToProfileArray(
                    type,
                    undefined,
                    `[${profile.id}]`,
                    icon,
                    JSON.stringify(schema.data || ''),
                  );
                  await executeSql(dbInstance, INSERT_EVENT_TYPE, typeArray);
                }
              } catch (error) {
                logSQL.error(`Profile Report type ${type.value} could not be inserted into the local database`, error);
              }
            }
          }
        }
      }
      logSQL.debug('profile event_type table updated');
    } catch (error) {
      logSQL.error('[populateProfileReportTypes] - getReportTypes: error', error);
    }
  }, []);

  const upsertReportTypes = useCallback(async (
    reportTypes: Type[],
    accessToken: string,
    user: UserInfo,
    onError?: (reportType: string) => void,
  ) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    if (dbInstance) {
      // eslint-disable-next-line no-restricted-syntax
      for (const type of reportTypes) {
        if (isReportTypeVisible(type)) {
          try {
            const icon = await getReportTypeIcon(type.icon_id) || '';
            const schema = await getReportTypeSchema(accessToken, type.value);

            if (user.type === UserType.account) {
              const typeArray = parseToActiveUserArray(type, accountId, icon, JSON.stringify(schema.data || ''));

              await executeSql(dbInstance, UPSERT_EVENT_TYPE_USER, typeArray);
            } else {
              const persistedReportType = await retrieveReportTypesProfileByValue(type.value);

              const profileId = hasEventCategoryAccess(
                user.permissions,
                type.category.value,
                PermissionLevel.add,
              )
                ? appendArrayProfileId(user.id, persistedReportType?.profileId || [])
                : JSON.parse(persistedReportType?.profileId || []);

              const typeArray = parseToActiveUserArray(type, JSON.stringify(profileId), icon, JSON.stringify(schema.data || ''));

              await executeSql(dbInstance, UPSERT_EVENT_TYPE_PROFILE, typeArray);
            }
          } catch (error) {
            logSQL.error(`Report type ${type.value} could not be inserted into the local database`, error);
            onError?.(type.value);
          }
        }
      }
    }
    logSQL.info('[End Upsert] - Report Types');
  }, []);

  // eslint-disable-next-line max-len
  const appendArrayProfileId = (userId: number, profileIdArray: any) => {
    if (profileIdArray && profileIdArray.length > 0) {
      const profiles = JSON.parse(profileIdArray);
      return profiles.includes(userId) ? profiles : [...profiles, userId];
    }
    return [userId];
  };

  return { populateReportTypes, populateProfileReportTypes, upsertReportTypes };
};
