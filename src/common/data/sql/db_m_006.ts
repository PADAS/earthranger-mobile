export const M_TABLE_SYNC_STATES = `CREATE TABLE IF NOT EXISTS sync_states(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER,
    resource TEXT,
    scope TEXT,
    state TEXT)`;
