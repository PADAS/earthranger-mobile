/* eslint-disable @typescript-eslint/quotes */
// ------------------------------------------------------------------------
// Indexes
// ------------------------------------------------------------------------
export const SUBJECT_GROUPS_IDX = `CREATE UNIQUE INDEX IF NOT EXISTS subject_groups_remote_id_idx
  ON subject_groups (remote_id)`;
export const SUBJECT_GROUPS_ID_IDX = 'CREATE INDEX IF NOT EXISTS subject_groups_id_idx ON subject_groups (id)';
export const SUBJECT_GROUPS_PARENT_ID_IDX = `CREATE INDEX IF NOT EXISTS subject_groups_parent_id_idx
  ON subject_groups (parent_id)`;
export const PROFILE_SUBJECT_GROUPS_PROFILE_ID_IDX = `CREATE INDEX IF NOT EXISTS profile_subject_groups_profile_id_idx
  ON profile_subject_groups(profile_id)`;
export const PROFILE_SUBJECT_GROUPS_SUBJECT_GROUP_ID_IDX = `CREATE INDEX IF NOT EXISTS
  profile_subject_groups_subject_group_id_idx
  ON profile_subject_groups(subject_group_id)`;

// ------------------------------------------------------------------------
// INSERT
// ------------------------------------------------------------------------

export const INSERT_PROFILE_SUBJECT_GROUPS = `INSERT INTO \
  profile_subject_groups(profile_id, subject_group_id) \
VALUES \
  (?, ?)`;

export const INSERT_SUBJECT_GROUPS = `INSERT INTO \
  subject_groups (remote_id, account_id, name, parent_id) \
VALUES \
  (?, ?, ?, ?)`;

export const INSERT_SUBJECT = `INSERT INTO \
  subjects (\
    remote_id,\
    name,\
    is_active,\
    icon_svg, \
    tracks_available,\
    last_position,\
    last_position_date,\
    updated_at\
  ) \
VALUES \
  (?, ?, ?, ?, ?, ?, ?, ?)`;

export const INSERT_SUBJECT_GROUP_MEMBERSHIP = `INSERT INTO \
  subject_group_memberships (\
    subject_group_id,\
    subject_id\
  ) \
VALUES \
  (?, ?)`;

// ------------------------------------------------------------------------
// UPDATE
// ------------------------------------------------------------------------
export const UPDATE_SUBJECT_GROUP = `UPDATE \
SET \
  remote_id = excluded.remote_id, \
  account_id = excluded.account_id, \
  parent_id = excluded.parent_id, \
  name = excluded.name`;

export const UPDATE_SUBJECTS = `UPDATE \
SET \
  name = excluded.name, \
  is_active = excluded.is_active, \
  tracks_available = excluded.tracks_available, \
  last_position = excluded.last_position, \
  last_position_date = excluded.last_position_date, \
  icon_svg = excluded.icon_svg, \
  updated_at = excluded.updated_at`;

// ------------------------------------------------------------------------
// SELECT
// ------------------------------------------------------------------------
export const SELECT_SUBJECTS = `SELECT \
  remote_id \
FROM \
  subjects`;

export const SELECT_SUBJECT_BY_REMOTE_ID = `SELECT \
  id \
FROM \
  subjects \
WHERE \
  remote_id = ?`;

export const SELECT_SUBJECT_ICON = `SELECT \
  icon_svg \
FROM \
  subjects \
WHERE \
  remote_id = ?`;

export const SELECT_SUBJECT_GROUP_BY_REMOTE_ID = `SELECT \
  id \
FROM \
  subject_groups \
WHERE \
  remote_id = ?`;

export const SELECT_PARENT_SUBJECT_GROUPS = `SELECT \
  id, \
  name \
FROM \
  subject_groups \
WHERE parent_id IS NULL`;

export const SELECT_SUBJECT_GROUPS = `SELECT \
  id, \
  name \
FROM \
  subject_groups \
WHERE parent_id = ?`;

export const SELECT_PROFILE_PARENT_SUBJECT_GROUPS = `SELECT sg.id, sg.name \
FROM subject_groups sg \
INNER JOIN profile_subject_groups psg ON sg.id = psg.subject_group_id \
WHERE sg.parent_id IS NULL AND psg.profile_id = ?`;

export const SELECT_PROFILE_SUBJECT_GROUPS = `SELECT sg.id, sg.name \
FROM subject_groups sg \
INNER JOIN profile_subject_groups psg ON sg.id = psg.subject_group_id \
WHERE sg.parent_id = ? AND psg.profile_id = ?`;

export const SELECT_ALL_SUBJECT_GROUPS = `SELECT \
  remote_id, \
  name \
FROM \
  subject_groups`;

export const SELECT_SUBJECTS_REMOTE_IDS = `SELECT \
  remote_id \
FROM \
  subjects`;

export const SELECT_SUBJECTS_BY_SUBJECT_GROUP = `SELECT \
  subjects.remote_id, \
  subjects.name, \
  subjects.icon_svg, \
  subjects.last_position, \
  subjects.last_position_date \
FROM \
  subject_group_memberships \
  JOIN subjects ON subjects.id = subject_group_memberships.subject_id \
WHERE \
  subject_group_memberships.subject_group_id = ? \
  AND last_position_date >= strftime('%Y-%m-%dT%H:%M:%S+00:00', 'now', '-16 days') \
  AND last_position_date <= strftime('%Y-%m-%dT%H:%M:%S+00:00', 'now')`;

export const SELECT_SUBJECTS_GEO_JSON = `SELECT \
  '{"type":"FeatureCollection","features":[' || GROUP_CONCAT(visibleSubjects.last_position, ',') || ']}' AS geojsonData \
FROM \
  (SELECT last_position, last_position_date FROM subjects WHERE remote_id IN (?)) AS visibleSubjects \
WHERE \
visibleSubjects.last_position LIKE '{"type":"Feature"%' \
  AND visibleSubjects.last_position LIKE '%"geometry":{"type":"Point"%' \
  AND visibleSubjects.last_position_date >= strftime('%Y-%m-%dT%H:%M:%S+00:00', 'now', '-16 days') \
  AND visibleSubjects.last_position_date <= strftime('%Y-%m-%dT%H:%M:%S+00:00', 'now')`;

export const SELECT_PROFILE_SUBJECTS_GEO_JSON = `SELECT \
  '{"type":"FeatureCollection","features":[' || GROUP_CONCAT(visibleSubjects.last_position, ',') || ']}' AS geojsonData \
FROM \
  (SELECT DISTINCT s.last_position, s.last_position_date \
   FROM subjects s \
   JOIN subject_group_memberships sgm ON s.id = sgm.subject_id \
   JOIN profile_subject_groups psg ON sgm.subject_group_id = psg.subject_group_id \
   WHERE psg.profile_id = ? \
   AND s.remote_id IN (?) \
  ) AS visibleSubjects \
WHERE \
  visibleSubjects.last_position LIKE '{"type":"Feature"%' \
  AND visibleSubjects.last_position LIKE '%"geometry":{"type":"Point"%' \
  AND visibleSubjects.last_position_date >= strftime('%Y-%m-%dT%H:%M:%S+00:00', 'now', '-16 days') \
  AND visibleSubjects.last_position_date <= strftime('%Y-%m-%dT%H:%M:%S+00:00', 'now')`;

// ------------------------------------------------------------------------
// UPSERT
// ------------------------------------------------------------------------
export const UPSERT_SUBJECT_GROUP = `INSERT INTO \
  subject_groups (remote_id, account_id, parent_id, name) \
VALUES \
  (?, ?, ?, ?) ON CONFLICT (remote_id) DO ${UPDATE_SUBJECT_GROUP}`;

export const UPSERT_SUBJECT = `INSERT INTO \
  subjects (\
    remote_id,\
    name,\
    is_active,\
    tracks_available,\
    last_position,\
    last_position_date,\
    icon_svg, \
    updated_at\
  ) \
VALUES \
  (?, ?, ?, ?, ?, ?, ?, ?) \
ON CONFLICT \
  (remote_id) \
DO \
  ${UPDATE_SUBJECTS}`;

// ------------------------------------------------------------------------
// DELETE
// ------------------------------------------------------------------------
export const DELETE_SUBJECT_GROUP = `DELETE FROM \
  subject_groups \
WHERE \
  remote_id = ?`;

export const DELETE_SUBJECT = `DELETE FROM \
  subjects \
WHERE \
  remote_id = ?`;

export const DELETE_MEMBERSHIPS = `DELETE FROM subject_group_memberships`;

export const DELETE_PROFILE_SUBJECT_GROUPS = `DELETE FROM profile_subject_groups`;
