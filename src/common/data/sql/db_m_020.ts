// accounts_user
export const DROP_TABLE_ACCOUNTS_USER_TEMP = 'DROP TABLE IF EXISTS accounts_user_temp';

export const TABLE_ACCOUNTS_USER_TEMP = `CREATE TABLE IF NOT EXISTS accounts_user_temp(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  content_type TEXT,
  subject_id TEXT,
  accepted_eula INTEGER,
  pin TEXT)`;

export const INSERT_TABLE_ACCOUNTS_USER_TEMP = 'INSERT INTO accounts_user_temp (id, remote_id, username, first_name, last_name, email, content_type, subject_id, accepted_eula, pin) SELECT id, remote_id, username, first_name, last_name, email, content_type, subject_id, accepted_eula, pin FROM accounts_user;';

export const DROP_TABLE_ACCOUNTS_USER = 'DROP TABLE IF EXISTS accounts_user';

export const ALTER_TABLE_ACCOUNTS_USER = 'ALTER TABLE accounts_user_temp RENAME TO accounts_user';

// user_profiles
export const DROP_TABLE_USER_PROFILES_TEMP = 'DROP TABLE IF EXISTS user_profiles_temp';

export const TABLE_USER_PROFILES_TEMP = `CREATE TABLE IF NOT EXISTS user_profiles_temp(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  username TEXT,
  content_type TEXT,
  subject_id TEXT,
  pin TEXT)`;

export const INSERT_TABLE_USER_PROFILES_TEMP = 'INSERT INTO user_profiles_temp (id, remote_id, account_id, username, content_type, subject_id, pin) SELECT id, remote_id, account_id, username, content_type, subject_id, pin FROM user_profiles;';

export const DROP_TABLE_USER_PROFILES = 'DROP TABLE IF EXISTS user_profiles';

export const ALTER_TABLE_USER_PROFILES = 'ALTER TABLE user_profiles_temp RENAME TO user_profiles';
