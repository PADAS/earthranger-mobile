import { PermissionLevel } from '../enums/enums';

export const hasEventCategoryAccess = (
  stringPermissions: string,
  category: string,
  level: PermissionLevel,
) => {
  try {
    const permissions = JSON.parse(stringPermissions);
    return permissions[category].includes(level);
  } catch {
    return false;
  }
};
