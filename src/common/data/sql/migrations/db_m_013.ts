export const M_TABLE_USER_PROFILES = `CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  username TEXT,
  reported_by_id TEXT,
  content_type TEXT,
  subject_id TEXT)`;
