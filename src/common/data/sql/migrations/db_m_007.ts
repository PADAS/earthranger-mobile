export const M_TABLE_PATROL_TYPES = `CREATE TABLE IF NOT EXISTS patrol_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  value TEXT,
  display TEXT,
  icon TEXT,
  icon_svg TEXT,
  default_priority INTEGER,
  is_active INTEGER)`;
