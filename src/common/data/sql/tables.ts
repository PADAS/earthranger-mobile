// ------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------

export const SCHEMA_VERSION = 39;

// ------------------------------------------------------------------------
// Tables
// ------------------------------------------------------------------------

export const TABLE_ACCOUNTS_USER = `CREATE TABLE IF NOT EXISTS accounts_user(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  content_type TEXT,
  subject_id TEXT,
  accepted_eula INTEGER,
  pin TEXT,
  permissions JSON,
  is_superuser INTEGER)`;

export const TABLE_EVENT_TYPE = `CREATE TABLE IF NOT EXISTS event_type(
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
  geometry_type TEXT,
  is_active INTEGER)`;

export const TABLE_EVENT_CATEGORY = `CREATE TABLE IF NOT EXISTS event_category(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT UNIQUE,
  account_id INTEGER,
  profile_id JSON,
  value TEXT,
  display TEXT,
  ordernum INTEGER,
  is_active INTEGER)`;

export const TABLE_EVENTS = `CREATE TABLE IF NOT EXISTS events(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  serial_number INTEGER,
  account_id INTEGER,
  profile_id INTEGER,
  event_type_id INTEGER,
  title TEXT,
  latitude REAL,
  longitude REAL,
  geometry TEXT,
  event_values TEXT,
  state TEXT,
  is_draft INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  patrol_segment_id INTEGER)`;

export const TABLE_ATTACHMENTS = `CREATE TABLE IF NOT EXISTS attachments(
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

export const TABLE_SYNC_STATES = `CREATE TABLE IF NOT EXISTS sync_states(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource TEXT NOT NULL,
  scope TEXT NOT NULL,
  state TEXT)`;

export const TABLE_PATROL_TYPES = `CREATE TABLE IF NOT EXISTS patrol_types (
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

export const TABLE_PATROLS = `CREATE TABLE IF NOT EXISTS patrols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  serial_number INTEGER,
  account_id INTEGER,
  profile_id INTEGER,
  title TEXT,
  priority TEXT,
  state TEXT,
  created_at REAL,
  updated_at REAL)`;

export const TABLE_PATROL_SEGMENTS = `CREATE TABLE IF NOT EXISTS patrol_segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  patrol_id INTEGER,
  patrol_type_id INTEGER,
  start_latitude REAL,
  start_longitude REAL,
  stop_latitude REAL,
  stop_longitude REAL,
  start_time REAL,
  end_time REAL)`;

export const TABLE_USER_PROFILES = `CREATE TABLE IF NOT EXISTS user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  username TEXT,
  content_type TEXT,
  subject_id TEXT,
  pin TEXT,
  permissions JSON)`;

export const TABLE_USER_SUBJECTS = `CREATE TABLE IF NOT EXISTS user_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  name TEXT,
  content_type TEXT)`;

export const TABLE_SUBJECTS = `CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  name TEXT,
  is_active INTEGER,
  updated_at INTEGER,
  tracks_available INTEGER,
  last_position_date INTEGER,
  last_position TEXT,
  icon_svg TEXT)`;

export const TABLE_SUBJECT_GROUPS = `CREATE TABLE IF NOT EXISTS subject_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  remote_id TEXT,
  account_id INTEGER,
  parent_id INTEGER,
  name TEXT,
  is_visible INTEGER,
  FOREIGN KEY(parent_id) REFERENCES subject_groups(id) ON DELETE CASCADE)`;

export const TABLE_SUBJECT_GROUP_MEMBERSHIPS = `CREATE TABLE IF NOT EXISTS subject_group_memberships (
  subject_group_id TEXT REFERENCES subject_groups(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (subject_group_id, subject_id))`;

export const TABLE_PROFILE_SUBJECT_GROUPS = `CREATE TABLE IF NOT EXISTS profile_subject_groups (
  profile_id INTEGER,
  subject_group_id INTEGER,
  PRIMARY KEY (profile_id, subject_group_id),
  FOREIGN KEY(profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY(subject_group_id) REFERENCES subject_groups(id) ON DELETE CASCADE)`;

// ------------------------------------------------------------------------
// Versioning
// ------------------------------------------------------------------------

export const DB_USER_VERSION = 'PRAGMA user_version';
export const DB_VERSION_UPDATE = `PRAGMA user_version = ${SCHEMA_VERSION}`;
