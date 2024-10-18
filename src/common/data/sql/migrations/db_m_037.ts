/* eslint-disable max-len */

// ------------------------------------------------------------------------
// Remove profile_id and change parent_id type in subject_groups table
// ------------------------------------------------------------------------
export const DROP_TABLE_SUBJECT_GROUPS_TEMP = 'DROP TABLE IF EXISTS subject_groups_temp';

export const TABLE_SUBJECT_GROUPS_TEMP = `CREATE TABLE IF NOT EXISTS subject_groups_temp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  parent_id INTEGER,
  name TEXT,
  is_visible INTEGER,
  FOREIGN KEY(parent_id) REFERENCES subject_groups(id) ON DELETE CASCADE)`;

export const INSERT_TABLE_SUBJECT_GROUPS_TEMP = `INSERT INTO subject_groups_temp(
  id, remote_id, account_id, parent_id, name, is_visible)
  SELECT id, remote_id, account_id, parent_id, name, is_visible FROM subject_groups`;

export const DROP_TABLE_SUBJECT_GROUPS = 'DROP TABLE IF EXISTS subject_groups';

export const ALTER_TABLE_SUBJECT_GROUPS = 'ALTER TABLE subject_groups_temp RENAME TO subject_groups';

export const M_37_SUBJECT_GROUPS_ID_IDX = `CREATE INDEX IF NOT EXISTS subject_groups_id_idx
  ON subject_groups (id)`;
export const M_37_SUBJECT_GROUPS_PARENT_ID_IDX = `CREATE INDEX IF NOT EXISTS subject_groups_parent_id_idx
  ON subject_groups (parent_id)`;

// ------------------------------------------------------------------------
// Create profile_subject_groups and indexes
// ------------------------------------------------------------------------
export const M_37_TABLE_PROFILE_SUBJECT_GROUPS = `CREATE TABLE IF NOT EXISTS profile_subject_groups (
  profile_id INTEGER,
  subject_group_id INTEGER,
  PRIMARY KEY (profile_id, subject_group_id),
  FOREIGN KEY(profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY(subject_group_id) REFERENCES subject_groups(id) ON DELETE CASCADE)`;

export const M_37_PROFILE_SUBJECT_GROUPS_PROFILE_ID_IDX = 'CREATE INDEX IF NOT EXISTS profile_subject_groups_profile_id_idx ON profile_subject_groups(profile_id)';

export const M_37_PROFILE_SUBJECT_GROUPS_SUBJECT_GROUP_ID_IDX = 'CREATE INDEX IF NOT EXISTS profile_subject_groups_subject_group_id_idx ON profile_subject_groups(subject_group_id)';
