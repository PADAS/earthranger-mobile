export const M_TABLE_PATROLS = `CREATE TABLE IF NOT EXISTS patrols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  title TEXT,
  priority TEXT,
  state TEXT,
  created_at REAL,
  updated_at REAL)`;
export const M_TABLE_PATROL_SEGMENTS = `CREATE TABLE IF NOT EXISTS patrol_segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  patrol_id INTEGER,
  patrol_type_id INTEGER,
  start_latitude REAL,
  start_longitude REAL,
  stop_latitude REAL,
  stop_longitude REAL,
  start_time REAL,
  end_time REAL)`;
