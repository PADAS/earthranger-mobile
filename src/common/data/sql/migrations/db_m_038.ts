export const M_38_DROP_SUBJECT_GROUPS_ID_IDX = 'DROP INDEX IF EXISTS subject_groups_id_idx';

export const M_38_DROP_TABLE_SUBJECT_GROUPS = 'DROP TABLE IF EXISTS subject_groups';

export const M_38_TABLE_SUBJECT_GROUPS = `CREATE TABLE IF NOT EXISTS subject_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  parent_id INTEGER,
  name TEXT,
  is_visible INTEGER,
  FOREIGN KEY(parent_id) REFERENCES subject_groups(id) ON DELETE CASCADE)`;

export const M_38_SUBJECT_GROUPS_ID_IDX = `CREATE UNIQUE INDEX IF NOT EXISTS subject_groups_id_idx
  ON subject_groups (remote_id)`;
