// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { getReportCategories, parseReportCategories } from '../../../api/reportsAPI';
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import {
  INSERT_EVENT_CATEGORY,
  UPDATE_EVENT_CATEGORY_ACCOUNT_BY_VALUE,
  UPDATE_EVENT_CATEGORY_BY_VALUE,
  UPDATE_EVENT_CATEGORY_PROFILE_BY_VALUE,
  UPSERT_EVENT_CATEGORY,
} from '../sql/queries';
import { logSQL } from '../../utils/logUtils';
import { useRetrieveUserProfiles } from '../users/useRetrieveUserProfiles';
import { USER_ID_KEY, USER_REMOTE_ID_KEY } from '../../constants/constants';
import { getSecuredStringForKey } from '../storage/utils';
import { useRetrieveReportCategories } from './useRetrieveReportCategories';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { PermissionLevel, UserType } from '../../enums/enums';
import { getListsDiff } from '../../utils/syncUtils';
import { hasEventCategoryAccess } from '../../utils/permissionsUtils';

export const usePopulateReportCategories = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveUserProfiles } = useRetrieveUserProfiles();
  const {
    retrieveReportCategory,
    retrieveReportCategoriesByUserType,
  } = useRetrieveReportCategories();
  const { retrieveUserInfo } = useRetrieveUser();

  const populateReportCategories = useCallback(async (accessToken: string) => {
    try {
      // Fetch information from remote database
      const reportCategories = await getReportCategories(accessToken);

      // Get database connection instance
      const dbInstance = await getDBInstance();

      // Get User Account ID
      const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

      if (dbInstance) {
        const parsedReportCategories = parseReportCategories(reportCategories.data, accountId);
        parsedReportCategories.forEach((category) => {
          insertData(dbInstance, INSERT_EVENT_CATEGORY, category);
        });
      }
      logSQL.debug('event_category table updated');
    } catch {
      logSQL.error('[Login] - getReportCategories: error');
    }
  }, []);

  const populateReportCategoriesForProfiles = useCallback(async (accessToken: string) => {
    try {
      // Fetch user profiles in local database
      const userProfiles = await retrieveUserProfiles();

      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        // eslint-disable-next-line no-restricted-syntax
        for (const profile of userProfiles) {
          // eslint-disable-next-line no-await-in-loop
          const reportCategories = await getReportCategories(
            accessToken,
            profile.remote_id,
          );

          if (reportCategories.data.length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const remoteCategory of reportCategories.data) {
              // eslint-disable-next-line no-await-in-loop
              const reportCategory = await retrieveReportCategory(
                remoteCategory.value,
              );

              if (hasEventCategoryAccess(profile.permissions || '', remoteCategory.value, PermissionLevel.add)) {
                if (reportCategory) {
                  if (reportCategory.profile_id) {
                    reportCategory.profile_id.push(profile.id);
                  } else {
                    reportCategory.profile_id = [profile.id];
                  }

                  // eslint-disable-next-line no-await-in-loop
                  await insertData(
                    dbInstance,
                    UPDATE_EVENT_CATEGORY_BY_VALUE,
                    [JSON.stringify(reportCategory.profile_id), remoteCategory.value],
                  );
                } else {
                  remoteCategory.profile_id = [profile.id];

                  const parsedReportCategory = parseReportCategories(
                    [remoteCategory],
                    undefined,
                  );

                  if (parsedReportCategory && parsedReportCategory.length > 0) {
                    // eslint-disable-next-line no-await-in-loop
                    await insertData(dbInstance, INSERT_EVENT_CATEGORY, parsedReportCategory[0]);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      logSQL.error(`Could not populate report categories for profiles - ${error}`);
    }
  }, []);

  const updateReportCategories = useCallback(async (reportCategoriesList: string[]) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        for (let i = 0, l = reportCategoriesList.length; i < l; i++) {
          // eslint-disable-next-line no-await-in-loop
          await insertData(
            dbInstance,
            UPDATE_EVENT_CATEGORY_ACCOUNT_BY_VALUE,
            // @ts-ignore
            [undefined, reportCategoriesList[i]],
          );
        }
      }
      logSQL.debug('event_category table updated');
    } catch {
      logSQL.error('updateReportCategories: error');
    }
  }, []);

  // eslint-disable-next-line max-len
  const updateReportCategoryProfiles = useCallback(async (profiles: string | undefined, category: string) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance) {
        // eslint-disable-next-line no-await-in-loop
        await insertData(
          dbInstance,
          UPDATE_EVENT_CATEGORY_PROFILE_BY_VALUE,
          // @ts-ignore
          [profiles, category],
        );
      }
      logSQL.debug('event_category table updated');
    } catch {
      logSQL.error('[Login] - getReportCategories: error');
    }
  }, []);

  const upsertReportCategoriesForProfiles = useCallback(async (accessToken: string) => {
    try {
      // Fetch user profile in local database
      const userProfileInfo = await retrieveUserInfo();

      // Get database connection instance
      const dbInstance = await getDBInstance();

      if (dbInstance && userProfileInfo) {
        const profileId = parseInt(userProfileInfo.userId || '', 10);
        // eslint-disable-next-line no-await-in-loop
        const reportCategories = await getReportCategories(
          accessToken,
          getSecuredStringForKey(USER_REMOTE_ID_KEY),
        );

        const existingReportCategories = await retrieveReportCategoriesByUserType(
          UserType.profile,
          profileId,
        );

        const reportCategoriesToDisable = getListsDiff(
          existingReportCategories,
          reportCategories.data,
        );

        if (reportCategories.data.length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for (const remoteCategory of reportCategories.data) {
            // eslint-disable-next-line no-await-in-loop
            const reportCategory = await retrieveReportCategory(
              remoteCategory.value,
            );

            if (reportCategory) {
              if (hasEventCategoryAccess(userProfileInfo.permissions || '', remoteCategory.value, PermissionLevel.add)) {
                if (reportCategory.profile_id) {
                  if (!reportCategory.profile_id.includes(profileId)) {
                    reportCategory.profile_id.push(
                      profileId,
                    );
                  }
                } else {
                  reportCategory.profile_id = [
                    profileId,
                  ];
                }
              } else if (reportCategory?.profile_id?.includes(profileId)) {
                // eslint-disable-next-line max-len
                reportCategory.profile_id = reportCategory.profile_id.filter((id: number) => id !== profileId);
              }

              // eslint-disable-next-line no-await-in-loop
              await insertData(
                dbInstance,
                UPDATE_EVENT_CATEGORY_BY_VALUE,
                [JSON.stringify(reportCategory.profile_id), remoteCategory.value],
              );
            } else if (hasEventCategoryAccess(userProfileInfo.permissions || '', remoteCategory.value, PermissionLevel.add)) {
              remoteCategory.profile_id = [profileId];

              const parsedReportCategory = parseReportCategories(
                [remoteCategory],
                undefined,
              );

              if (parsedReportCategory && parsedReportCategory.length > 0) {
                // eslint-disable-next-line no-await-in-loop
                await insertData(dbInstance, INSERT_EVENT_CATEGORY, parsedReportCategory[0]);
              }
            }
          }
        }

        if (reportCategoriesToDisable.length > 0) {
          for (let i = 0, l = reportCategoriesToDisable.length; i < l; i++) {
            // eslint-disable-next-line no-await-in-loop
            const reportCategory = await retrieveReportCategory(
              reportCategoriesToDisable[i],
            );

            const reportCategoryProfiles = reportCategory?.profile_id;
            let profilesList;

            if (reportCategoryProfiles) {
              reportCategoryProfiles.splice(
                reportCategoryProfiles.indexOf(profileId),
                1,
              );

              if (reportCategoryProfiles.length === 0) {
                profilesList = undefined;
              } else {
                profilesList = JSON.stringify(reportCategoryProfiles);
              }
            }

            // eslint-disable-next-line no-await-in-loop
            await updateReportCategoryProfiles(
              profilesList,
              reportCategoriesToDisable[i],
            );
          }
        }
      }
    } catch (error) {
      logSQL.error(`Could not update report categories for profiles - ${error}`);
    }
  }, []);

  const upsertReportCategories = useCallback(async (reportCategories) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    // Get User Account ID
    const accountId = getSecuredStringForKey(USER_ID_KEY) || '';

    if (dbInstance) {
      const parsedReportCategories = parseReportCategories(
        reportCategories,
        accountId.toString(),
      );
      parsedReportCategories.forEach((category) => {
        insertData(dbInstance, UPSERT_EVENT_CATEGORY, category);
      });
    }
    logSQL.info('[End Upsert] - Report Categories');
  }, []);

  return {
    populateReportCategories,
    upsertReportCategories,
    populateReportCategoriesForProfiles,
    upsertReportCategoriesForProfiles,
    updateReportCategories,
  };
};
