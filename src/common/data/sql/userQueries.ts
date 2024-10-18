/* eslint-disable max-len */
// ------------------------------------------------------------------------
// Indexes
// ------------------------------------------------------------------------
export const ACCOUNTS_USER_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS accounts_context_id_idx ON accounts_user (remote_id)';
export const USER_PROFILES_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_id_idx ON user_profiles (remote_id)';
export const USER_SUBJECTS_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS user_subjects_id_idx ON user_subjects (remote_id)';

// ------------------------------------------------------------------------
// DELETE
// ------------------------------------------------------------------------
export const DELETE_USER_PROFILE_BY_ID = 'DELETE FROM user_profiles WHERE remote_id = ?';

// ------------------------------------------------------------------------
// INSERT
// ------------------------------------------------------------------------
export const INSERT_USER = 'INSERT INTO accounts_user (remote_id, username, first_name, last_name, email, content_type, subject_id, accepted_eula, pin, permissions, is_superuser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const INSERT_USER_PROFILE = 'INSERT INTO user_profiles (remote_id, account_id, username, pin, content_type, subject_id, permissions) VALUES (?, ?, ?, ?, ?, ?, ?)';
export const INSERT_USER_SUBJECTS = 'INSERT INTO user_subjects (remote_id, account_id, name, content_type) VALUES (?, ?, ?, ?)';

// ------------------------------------------------------------------------
// UPDATE
// ------------------------------------------------------------------------
const UPDATE_USER = 'UPDATE SET username=excluded.username, first_name=excluded.first_name, last_name=excluded.last_name, email=excluded.email, content_type=excluded.content_type, subject_id=excluded.subject_id, accepted_eula=excluded.accepted_eula, pin=excluded.pin, permissions=excluded.permissions, is_superuser=excluded.is_superuser';
const UPDATE_USER_PROFILE = 'UPDATE SET username=excluded.username, pin=excluded.pin, content_type=excluded.content_type, subject_id=excluded.subject_id, permissions=excluded.permissions';
export const UPSERT_USER = `INSERT INTO accounts_user (remote_id, username, first_name, last_name, email, content_type, subject_id, accepted_eula, pin, permissions, is_superuser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (remote_id) DO ${UPDATE_USER}`;
export const UPSERT_USER_PROFILE = `INSERT OR REPLACE INTO user_profiles (remote_id, account_id, username, pin, content_type, subject_id, permissions) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (remote_id) DO ${UPDATE_USER_PROFILE}`;

// ------------------------------------------------------------------------
// SELECT
// ------------------------------------------------------------------------
export const SELECT_USER_BY_ID = 'SELECT * FROM accounts_user WHERE id = ?';
export const SELECT_USER_BY_PIN = 'SELECT remote_id, username, subject_id, pin FROM accounts_user WHERE pin = ? UNION SELECT remote_id, username, subject_id, pin FROM user_profiles WHERE pin = ?';
export const SELECT_USER_BY_REMOTE_ID = 'SELECT id, permissions FROM accounts_user WHERE remote_id = ?';
export const SELECT_USER_BY_USERNAME = 'SELECT * FROM accounts_user WHERE LOWER(username) = LOWER(?)';
export const SELECT_USER_PROFILE_BY_REMOTE_ID = 'SELECT id, permissions FROM user_profiles WHERE remote_id = ?';
export const SELECT_USER_PROFILE_BY_USERNAME = 'SELECT id, remote_id, account_id, username, content_type FROM user_profiles WHERE LOWER(username) = LOWER(?)';
export const SELECT_USER_PROFILE_PINS = 'SELECT accounts_user.pin AS userPin, user_profiles.pin AS profilePin  FROM accounts_user JOIN user_profiles WHERE accounts_user.id = ? AND accounts_user.id = user_profiles.account_id;';
export const SELECT_USER_SUBJECTS = 'SELECT id, remote_id, account_id, name, content_type FROM user_subjects';
export const SELECT_USER_PROFILES = 'SELECT * FROM user_profiles';
export const SELECT_USER_PROFILES_REMOTE_ID = 'SELECT id, remote_id, permissions FROM user_profiles';
export const SELECT_USER_PROFILE_BY_ID = 'SELECT remote_id, content_type, subject_id FROM user_profiles WHERE id = ?';
export const SELECT_USER_PROFILE_BY_SUBJECT_ID = 'SELECT remote_id FROM user_profiles WHERE subject_id = ?';
