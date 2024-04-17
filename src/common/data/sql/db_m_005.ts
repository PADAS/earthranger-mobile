export const DROP_TABLE_EVENT_CATEGORY_TEMP = 'DROP TABLE IF EXISTS event_category_temp';

export const TABLE_EVENT_CATEGORY_TEMP = `CREATE TABLE IF NOT EXISTS event_category_temp(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            remote_id TEXT UNIQUE,
            account_id INTEGER,
            value TEXT,
            display TEXT,
            ordernum INTEGER)`;

export const INSERT_TABLE_EVENT_CATEGORY_TEMP = 'INSERT INTO event_category_temp (id, remote_id, account_id, value, display, ordernum) SELECT id, remote_id, account_id, value, display, ordernum FROM event_category;';

export const DROP_TABLE_EVENT_CATEGORY = 'DROP TABLE IF EXISTS event_category';

export const ALTER_TABLE_EVENT_CATEGORY = 'ALTER TABLE event_category_temp RENAME TO event_category';
