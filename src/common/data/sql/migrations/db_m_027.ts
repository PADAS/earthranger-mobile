// EVENT_TYPE Table

export const DROP_TABLE_EVENT_TYPE_TEMP_M27 = 'DROP TABLE IF EXISTS event_type_temp_m27';

export const TABLE_EVENT_TYPE_TEMP_M27 = `
  CREATE TABLE IF NOT EXISTS event_type_temp_m27 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id TEXT UNIQUE,
    account_id INTEGER,
    profile_id JSON,
    value TEXT,
    display TEXT,
    schema TEXT,
    category_id TEXT,
    default_priority INTEGER,
    icon TEXT,
    icon_svg TEXT,
    geometry_type TEXT
  )`;

export const INSERT_TABLE_EVENT_TYPE_TEMP_M27 = `
  INSERT INTO event_type_temp_m27 (
    id,
    remote_id,
    account_id,
    profile_id,
    value,
    display,
    schema,
    category_id,
    default_priority,
    icon,
    icon_svg,
    geometry_type
  ) SELECT
    id,
    remote_id,
    account_id,
    profile_id,
    value,
    display,
    schema,
    category_id,
    default_priority,
    icon,
    icon_svg,
    geometry_type
  FROM event_type`;

export const DROP_TABLE_EVENT_TYPE_M27 = 'DROP TABLE IF EXISTS event_type';

export const ALTER_TABLE_EVENT_TYPE_M27 = 'ALTER TABLE event_type_temp_m27 RENAME TO event_type';

// EVENT_CATEGORY Table

export const DROP_TABLE_EVENT_CATEGORY_TEMP_M27 = 'DROP TABLE IF EXISTS event_category_temp_m27';

export const TABLE_EVENT_CATEGORY_TEMP_M27 = `
  CREATE TABLE IF NOT EXISTS event_category_temp_m27 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id TEXT UNIQUE,
    account_id INTEGER,
    profile_id JSON,
    value TEXT,
    display TEXT,
    ordernum INTEGER
  );
`;

export const INSERT_TABLE_EVENT_CATEGORY_TEMP_M27 = `
  INSERT INTO event_category_temp_m27 (
    id,
    remote_id,
    account_id,
    profile_id,
    value,
    display,
    ordernum
  ) SELECT
    id,
    remote_id,
    account_id,
    profile_id,
    value,
    display,
    ordernum
  FROM event_category`;

export const DROP_TABLE_EVENT_CATEGORY_M27 = 'DROP TABLE IF EXISTS event_category';

export const ALTER_TABLE_EVENT_CATEGORY_M27 = 'ALTER TABLE event_category_temp_m27 RENAME TO event_category';
