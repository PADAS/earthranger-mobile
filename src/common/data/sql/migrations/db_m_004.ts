export const DROP_TABLE_EVENT_TYPE_TEMP = 'DROP TABLE IF EXISTS event_type_temp';

export const TABLE_EVENT_TYPE_TEMP = `CREATE TABLE IF NOT EXISTS event_type_temp(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            remote_id TEXT UNIQUE,
            account_id INTEGER,
            value TEXT,
            display TEXT,
            schema TEXT,
            category_id TEXT,
            default_priority INTEGER,
            icon TEXT,
            icon_svg TEXT,
            geometry_type TEXT)`;

export const INSERT_TABLE_EVENT_TYPE_TEMP = 'INSERT INTO event_type_temp (id, remote_id, account_id, value, display, schema, category_id, default_priority, icon, icon_svg, geometry_type) SELECT id, remote_id, account_id, value, display, schema, category_id, default_priority, icon, icon_svg, geometry_type FROM event_type;';

export const DROP_TABLE_EVENT_TYPE = 'DROP TABLE IF EXISTS event_type';

export const ALTER_TABLE_EVENT_TYPE = 'ALTER TABLE event_type_temp RENAME TO event_type';
