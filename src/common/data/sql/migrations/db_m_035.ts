// ------------------------------------------------------------------------
// Add parent_id to subject_gropus
// ------------------------------------------------------------------------
export const M_ALTER_TABLE_SUBJECT_GROUPS = `ALTER TABLE
  main.subject_groups
ADD COLUMN
  parent_id INTEGER
REFERENCES subject_groups(id)
ON DELETE CASCADE`;

// ------------------------------------------------------------------------
// Remove subject_group_id from subjects
// ------------------------------------------------------------------------
export const M_DROP_SUBJECTS_TEMP = 'DROP TABLE IF EXISTS subjects_temp';

export const M_TABLE_SUBJECTS_TEMP = `CREATE TABLE IF NOT EXISTS subjects_temp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  name TEXT,
  is_active INTEGER,
  updated_at INTEGER,
  tracks_available INTEGER,
  last_position_date INTEGER,
  last_position TEXT)`;

export const M_INSERT_TABLE_SUBJECTS_TEMP = `INSERT INTO subjects_temp(
    id,
    remote_id,
    name,
    is_active,
    updated_at,
    tracks_available,
    last_position_date,
    last_position)
  SELECT
    id,
    remote_id,
    name,
    is_active,
    updated_at,
    tracks_available,
    last_position_date,
    last_position
  FROM subjects`;

export const M_DROP_TABLE_SUBJECTS = 'DROP TABLE IF EXISTS subjects';

export const M_ALTER_TABLE_SUBJECTS_TEMP = 'ALTER TABLE subjects_temp RENAME TO subjects';

// ------------------------------------------------------------------------
// Create subject_group_memberships table
// ------------------------------------------------------------------------
export const M_TABLE_SUBJECT_GROUP_MEMBERSHIPS = `CREATE TABLE IF NOT EXISTS subject_group_memberships (
  subject_group_id TEXT REFERENCES subject_groups(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (subject_group_id, subject_id))`;
