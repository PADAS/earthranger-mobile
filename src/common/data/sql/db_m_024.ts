// event_type
export const TABLE_EVENT_TYPE_TEMP_M24 = `CREATE TABLE IF NOT EXISTS event_type_temp(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT UNIQUE,
  account_id INTEGER,
  profile_id INTEGER,
  value TEXT,
  display TEXT,
  schema TEXT,
  category_id TEXT,
  default_priority INTEGER,
  icon TEXT,
  icon_svg TEXT,
  geometry_type TEXT)`;

export const INSERT_TABLE_EVENT_TYPE_TEMP_M24 = 'INSERT INTO event_type_temp (id, remote_id, account_id, profile_id, value, display, schema, category_id, default_priority, icon, icon_svg, geometry_type) SELECT id, remote_id, account_id, profile_id, value, display, schema, category_id, default_priority, icon, icon_svg, geometry_type FROM event_type;';

// event_category
export const TABLE_EVENT_CATEGORY_TEMP_M24 = `CREATE TABLE IF NOT EXISTS event_category_temp(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id TEXT UNIQUE,
    account_id INTEGER,
    profile_id INTEGER,
    value TEXT,
    display TEXT,
    ordernum INTEGER)`;

export const INSERT_TABLE_EVENT_CATEGORY_TEMP_M24 = 'INSERT INTO event_category_temp (id, remote_id, account_id, profile_id, value, display, ordernum) SELECT id, remote_id, account_id, profile_id, value, display, ordernum FROM event_category;';

// attachments
export const DROP_TABLE_ATTACHMENTS_TEMP = 'DROP TABLE IF EXISTS attachments_temp';

export const TABLE_ATTACHMENTS_TEMP = `CREATE TABLE IF NOT EXISTS attachments_temp(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id TEXT,
    account_id INTEGER,
    profile_id INTEGER,
    event_id TEXT,
    type TEXT,
    path TEXT,
    thumbnail_path TEXT,
    note_text TEXT,
    uploaded INTEGER)`;

export const INSERT_TABLE_ATTACHMENTS_TEMP = 'INSERT INTO attachments_temp (id, remote_id, account_id, profile_id, event_id, type, path, thumbnail_path, note_text, uploaded) SELECT id, remote_id, account_id, profile_id, event_id, type, path, thumbnail_path, note_text, uploaded FROM attachments;';

export const DROP_TABLE_ATTACHMENTS = 'DROP TABLE IF EXISTS attachments';

export const ALTER_TABLE_ATTACHMENTS = 'ALTER TABLE attachments_temp RENAME TO attachments';

// patrol_types
export const DROP_TABLE_PATROL_TYPES_TEMP = 'DROP TABLE IF EXISTS patrol_types_temp';

export const TABLE_PATROL_TYPES_TEMP = `CREATE TABLE IF NOT EXISTS patrol_types_temp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remote_id TEXT,
    account_id INTEGER,
    profile_id INTEGER,
    value TEXT,
    display TEXT,
    icon TEXT,
    icon_svg TEXT,
    default_priority INTEGER,
    is_active INTEGER,
    ordernum INTEGER)`;

export const INSERT_TABLE_PATROL_TYPES_TEMP = 'INSERT INTO patrol_types_temp (id, remote_id, account_id, profile_id, value, display, icon, icon_svg, default_priority, is_active, ordernum) SELECT id, remote_id, account_id, profile_id, value, display, icon, icon_svg, default_priority, is_active, ordernum FROM patrol_types;';

export const DROP_TABLE_PATROL_TYPES = 'DROP TABLE IF EXISTS patrol_types';

export const ALTER_TABLE_PATROL_TYPES = 'ALTER TABLE patrol_types_temp RENAME TO patrol_types';
