/* eslint-disable max-len */

export const TABLE_SUBJECT_GROUPS_M = `CREATE TABLE IF NOT EXISTS subject_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  profile_id TEXT,
  name TEXT,
  is_visible INTEGER)`;

export const DROP_INDEX_SUBJECT_GROUPS_IDX = 'DROP INDEX IF EXISTS subject_groups_remote_id_idx';
export const ADD_INDEX_SUBJECT_GROUPS_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS subject_groups_remote_id_idx ON subject_groups (remote_id)';

export const TABLE_SUBJECTS_M = `CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  subject_group_id INTEGER,
  name TEXT,
  is_active INTEGER,
  updated_at INTEGER,
  tracks_available INTEGER,
  last_position_date INTEGER,
  last_position TEXT)`;

export const DROP_INDEX_SUBJECT_IDX = 'DROP INDEX IF EXISTS subject_remote_id_idx';
export const ADD_INDEX_SUBJECT_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS subject_remote_id_idx ON subjects (remote_id)';
