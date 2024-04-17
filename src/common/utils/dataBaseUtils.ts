// ------------------------------------------------------------------------
// public functions
// ------------------------------------------------------------------------

// Internal Dependencies
import { PermissionLevel } from '../enums/enums';

// Creates a query string by replacing all instances of `?` in provided query
// with corresponding values in params array
export const bindQueryParams = (query: string, params: any[]) => {
  let index = 0;
  // eslint-disable-next-line no-plusplus
  return query.replace(/\?/g, () => params[index++]);
};

export const getCategoryPermissionQueryParams = (
  stringPermissions: string | null | undefined,
  permitType: PermissionLevel,
) => {
  if (stringPermissions) {
    try {
      const permissions = JSON.parse(stringPermissions);
      const categoryParams = Object.keys(permissions).filter((category: string) => (permissions[category].includes(permitType)))?.map((category: string) => `value = '${category}'`)?.join(' OR ');
      return categoryParams || '';
    } catch {
      return '';
    }
  }
  return '';
};
