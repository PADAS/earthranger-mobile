export const DROP_TABLE_EVENTS_TEMP = 'DROP TABLE IF EXISTS events_temp';

export const TABLE_EVENTS_TEMP = `CREATE TABLE IF NOT EXISTS events_temp(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  profile_id INTEGER,
  event_type_id INTEGER,
  title TEXT,
  latitude REAL,
  longitude REAL,
  geometry TEXT,
  event_values TEXT,
  state TEXT,
  is_draft INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  patrol_segment_id INTEGER)`;

export const INSERT_TABLE_EVENTS_TEMP = 'INSERT INTO events_temp (id, remote_id, account_id, profile_id, event_type_id, title, latitude, longitude, geometry, event_values, state, is_draft, created_at, updated_at, patrol_segment_id) SELECT id, remote_id, account_id, profile_id, event_type_id, title, latitude, longitude, geometry, event_values, state, is_draft, created_at, updated_at, patrol_segment_id FROM events;';

export const DROP_TABLE_EVENTS = 'DROP TABLE IF EXISTS events';

export const ALTER_TABLE_EVENTS = 'ALTER TABLE events_temp RENAME TO events';
