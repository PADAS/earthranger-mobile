// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import {
  SELECT_PROFILE_PATROL_PERMISSIONS,
  SELECT_USER_PATROL_PERMISSIONS,
} from '../sql/queries';
import { useRetrieveUser } from '../users/useRetrieveUser';
import { PermissionLevel, Permissions, UserType } from '../../enums/enums';

export const useRetrievePatrolPermissions = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo } = useRetrieveUser();

  const isPermissionAvailable = useCallback(async (
    permission: Permissions,
    level: PermissionLevel = PermissionLevel.add,
  ) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();
    const userInfo = await retrieveUserInfo();
    const activeUserId = (userInfo && userInfo.userId !== null) ? `${userInfo.userId}` : '';

    if (dbInstance) {
      // Get information from the local database
      const permissions = await retrieveData(
        dbInstance,
        userInfo?.userType === UserType.profile
          ? SELECT_PROFILE_PATROL_PERMISSIONS : SELECT_USER_PATROL_PERMISSIONS,
        [activeUserId],
      );
      return permissions && permissions.length > 0
        ? containsPermissionLevel(
          JSON.parse(permissions[0].rows.item(0).permissions) || {},
          permission,
          level,
        )
        : false;
    }

    return false;
  }, []);

  return { isPermissionAvailable };
};

export const useRetrieveEventPermissions = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();
  const { retrieveUserInfo } = useRetrieveUser();

  const userHasEventsPermissions = useCallback(async () => {
    // Get database connection instance
    const dbInstance = await getDBInstance();
    const userInfo = await retrieveUserInfo();
    const activeUserId = (userInfo && userInfo.userId !== null) ? `${userInfo.userId}` : '';

    if (dbInstance) {
      // Get information from the local database
      const permissions = await retrieveData(
        dbInstance,
        userInfo?.userType === UserType.profile
          ? SELECT_PROFILE_PATROL_PERMISSIONS : SELECT_USER_PATROL_PERMISSIONS,
        [activeUserId],
      );

      if (permissions && permissions.length > 0) {
        const permissionsJSON = JSON.parse(permissions[0].rows.item(0).permissions || {});

        if (Object.keys(permissionsJSON).length > 1
          && containsPermission(permissionsJSON, Permissions.patrol)
        ) {
          return true;
        }
      }
    }

    return false;
  }, []);

  return {
    userHasEventsPermissions,
  };
};

const containsPermission = (
  permissions: any,
  permission: Permissions,
) => Object.keys(permissions).some((key) => key === permission);

const containsPermissionLevel = (
  permissions: any,
  permission: Permissions,
  level: PermissionLevel,
) => containsPermission(permissions, permission) && permissions[permission].includes(level);
