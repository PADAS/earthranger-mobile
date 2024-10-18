export const M_TABLE_USER_SUBJECTS = `CREATE TABLE IF NOT EXISTS user_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  name TEXT,
  content_type TEXT)`;
