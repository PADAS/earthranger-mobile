export const DROP_INDEX_ACCOUNTS_USER_IDX = 'DROP INDEX IF EXISTS accounts_context_id_idx';
export const ADD_INDEX_ACCOUNTS_USER_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS accounts_context_id_idx ON accounts_user (remote_id)';

export const DROP_INDEX_USER_PROFILES_IDX = 'DROP INDEX IF EXISTS user_profiles_id_idx';
export const ADD_INDEX_USER_PROFILES_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_id_idx ON user_profiles (remote_id)';
