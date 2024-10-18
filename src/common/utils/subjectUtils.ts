// Internal Dependencies
import { SubjectGroup } from '../types/subjectsResponse';

// ------------------------------------------------------------------------
// public functions
// ------------------------------------------------------------------------

// Recursively flatten nested subject group structure
// preserves heirarchy with parentId
export const flattenSubjectGroups = (
  groups: SubjectGroup[],
  parentId?: string,
): SubjectGroup[] => groups.reduce((acc: SubjectGroup[], group: SubjectGroup) => {
  const flatGroup = { ...group, parentId, subgroups: [] };
  acc.push(flatGroup);
  if (group.subgroups && group.subgroups.length > 0) {
    acc.push(...flattenSubjectGroups(group.subgroups, group.id));
  }
  return acc;
}, []);
