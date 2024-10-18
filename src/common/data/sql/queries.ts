/* eslint-disable max-len */
// ------------------------------------------------------------------------
// Indexes
// ------------------------------------------------------------------------
export const EVENT_TYPE_IDX = 'CREATE INDEX IF NOT EXISTS event_type_id_idx ON event_type (remote_id)';
export const EVENT_TYPE_DISPLAY_IDX = 'CREATE INDEX IF NOT EXISTS event_type_display_idx ON event_type (display)';
export const EVENT_CATEGORY_IDX = 'CREATE INDEX IF NOT EXISTS event_category_id_idx ON event_category (remote_id)';
export const EVENTS_IDX = 'CREATE INDEX IF NOT EXISTS events_id_idx ON events (remote_id)';
export const ATTACHMENTS_IDX = 'CREATE INDEX IF NOT EXISTS attachments_id_idx ON attachments (remote_id)';

export const SYNC_STATES_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS sync_states_account_resource_scope_idx ON sync_states (account_id ASC, resource ASC, scope ASC)';
export const PATROL_TYPES_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS patrol_types_id_idx ON patrol_types (remote_id)';
export const SUBJECTS_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS subject_remote_id_idx ON subjects (remote_id)';

// ------------------------------------------------------------------------
// SQL Queries
// ------------------------------------------------------------------------

// Insert Statements
export const INSERT_EVENT_PROFILE = 'INSERT INTO events (account_id, profile_id, event_type_id, title, latitude, longitude, geometry, event_values, is_draft, created_at, updated_at, patrol_segment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const INSERT_EVENT_USER = 'INSERT INTO events (account_id, event_type_id, title, latitude, longitude, geometry, event_values, is_draft, created_at, updated_at, patrol_segment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const INSERT_EVENT_TYPE = 'INSERT INTO event_type (remote_id, account_id, profile_id, value, display, schema, category_id, geometry_type, default_priority, icon, icon_svg, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const INSERT_EVENT_CATEGORY = 'INSERT INTO event_category (remote_id, account_id, profile_id, value, display, ordernum) VALUES (?, ?, ?, ?, ?, ?)';
export const INSERT_ATTACHMENT = 'INSERT INTO attachments (account_id, event_id, type, path, thumbnail_path, note_text, uploaded) VALUES (?, ?, ?, ?, ?, ?, ?)';
export const INSERT_SYNC_STATE = 'INSERT INTO sync_states(account_id, resource, scope, state) VALUES (?, ?, ?, ?)';
export const INSERT_PATROL_TYPE = 'INSERT INTO patrol_types (remote_id, account_id, value, display, icon, icon_svg, default_priority, is_active, ordernum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const INSERT_PATROL_START = 'INSERT INTO patrols (title, state, created_at, account_id, profile_id) VALUES (?, \'open\', ?, ?, ?)';
export const INSERT_PATROL_SEGMENTS_START = 'INSERT INTO patrol_segments (remote_id, patrol_id, patrol_type_id, start_latitude, start_longitude, start_time) VALUES (?, ?, ?, ?, ?, ?)';

// Update Statements
export const UPDATE_ATTACHMENT_UPLOAD = 'UPDATE attachments SET uploaded = ? WHERE id = ?';
export const UPDATE_EVENT_REMOTE_ID = 'UPDATE events SET remote_id = ?, serial_number = ?, state = NULL WHERE id = ?';
export const UPDATE_ATTACHMENT_REMOTE_ID = 'UPDATE attachments SET remote_id = ?, uploaded = 1 WHERE id = ?';
export const UPDATE_EVENT_TYPE_USER = 'UPDATE SET account_id=excluded.account_id, value=excluded.value, display=excluded.display, schema=excluded.schema, category_id=excluded.category_id, geometry_type=excluded.geometry_type, default_priority=excluded.default_priority, icon=excluded.icon, icon_svg=excluded.icon_svg, is_active=excluded.is_active';
export const UPDATE_EVENT_TYPE_PROFILE = 'UPDATE SET profile_id=excluded.profile_id, value=excluded.value, display=excluded.display, schema=excluded.schema, category_id=excluded.category_id, geometry_type=excluded.geometry_type, default_priority=excluded.default_priority, icon=excluded.icon, icon_svg=excluded.icon_svg, is_active=excluded.is_active';
export const UPDATE_EVENT_CATEGORY = 'UPDATE SET value=excluded.value, display=excluded.display, ordernum=excluded.ordernum';
export const UPDATE_EVENT_CATEGORY_BY_VALUE = 'UPDATE event_category SET profile_id = ? WHERE value = ?';
export const UPDATE_EVENT = 'UPDATE events SET account_id = ?, event_type_id = ?, title = ?, latitude = ?, longitude = ?, geometry = ?, event_values = ?, is_draft = ?, updated_at = ? WHERE id = ?';
export const UPDATE_EVENT_STATE = 'UPDATE events SET state = ? WHERE id = ?';
export const UPDATE_ATTACHMENT_NOTE = 'UPDATE attachments SET note_text = ? WHERE id = ?';
export const UPDATE_SYNC_STATE_SCOPE = 'UPDATE sync_states SET state = ?, scope = ? WHERE  account_id = ? AND resource = ?';
export const UPDATE_PATROL_TYPE = 'UPDATE SET value=excluded.value, display=excluded.display, icon=excluded.icon, icon_svg=excluded.icon_svg, default_priority=excluded.default_priority, is_active=excluded.is_active, ordernum=excluded.ordernum';
export const UPDATE_PATROL_REMOTE_ID = 'UPDATE patrols SET remote_id = ?, serial_number = ?, state = ? WHERE id = ?';
export const UPDATE_PATROL_STATE = 'UPDATE patrols SET state = ? WHERE id = ?';
export const UPDATE_PATROL_SEGMENTS_REMOTE_ID = 'UPDATE patrol_segments SET remote_id = ? WHERE patrol_id = ?';
export const UPDATE_PATROL_STOP = 'UPDATE patrols SET updated_at = ? WHERE id = ?';
export const UPDATE_PATROL_SEGMENT_STOP = 'UPDATE patrol_segments SET stop_latitude = ?, stop_longitude = ?, end_time = ? WHERE id = ?';
export const UPDATE_EVENT_CATEGORY_ACCOUNT_BY_VALUE = 'UPDATE event_category SET account_id = ? WHERE value = ?';
export const UPDATE_EVENT_CATEGORY_PROFILE_BY_VALUE = 'UPDATE event_category SET profile_id = ? WHERE value = ?';

// Upsert Statements
export const UPSERT_EVENT_TYPE_USER = `INSERT INTO event_type (remote_id, account_id, value, display, schema, category_id, geometry_type, default_priority, icon, icon_svg, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (remote_id) DO ${UPDATE_EVENT_TYPE_USER}`;
export const UPSERT_EVENT_TYPE_PROFILE = `INSERT INTO event_type (remote_id, profile_id, value, display, schema, category_id, geometry_type, default_priority, icon, icon_svg, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (remote_id) DO ${UPDATE_EVENT_TYPE_PROFILE}`;
export const UPDATE_EVENT_TYPE_PROFILE_ID_BY_VALUE = 'UPDATE event_type SET profile_id = ? WHERE value = ?';
export const UPDATE_EVENT_TYPE_ACCOUNT_ID_BY_VALUE = 'UPDATE event_type SET account_id = ? WHERE value = ?';
export const UPSERT_EVENT_CATEGORY = `INSERT INTO event_category (remote_id, account_id, profile_id, value, display, ordernum) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (remote_id) DO ${UPDATE_EVENT_CATEGORY}`;
export const UPSERT_PATROL_TYPE = `INSERT INTO patrol_types (remote_id, account_id, value, display, icon, icon_svg, default_priority, is_active, ordernum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (remote_id) DO ${UPDATE_PATROL_TYPE}`;

// Remove Statements
export const REMOVE_DRAFT_EVENT = 'DELETE FROM events WHERE id = ?';
export const REMOVE_DRAFT_ATTACHMENTS = 'DELETE FROM attachments WHERE event_id = ?';
export const DELETE_EVENT_TYPES_BY_VALUE = 'DELETE from event_type WHERE event_type.value = ?';
export const DELETE_ATTACHMENT_NOTE = 'DELETE FROM attachments WHERE id = ?';
export const DELETE_PATROL_TYPE_BY_ID = 'DELETE FROM patrol_types WHERE patrol_types.remote_id = ?';
export const DELETE_REPORT_BY_ID = 'DELETE FROM events WHERE id = ?';
export const DELETE_ATTACHMENTS_BY_REPORT_ID = 'DELETE FROM attachments WHERE event_id = ?';

// Select Statements
export const SELECT_EVENT_CATEGORY_FILTER_EMPTY_TYPE = 'SELECT event_category.* FROM event_category INNER JOIN event_type on event_category.remote_id = event_type.category_id WHERE event_category.account_id = ? GROUP BY event_category.display ORDER BY event_category.ordernum, event_category.value';
export const SELECT_EVENT_CATEGORY_BY_VALUE = 'SELECT id, value, display, ordernum, account_id, profile_id FROM event_category WHERE value = ?';
export const SELECT_EVENT_CATEGORIES_FOR_PARENT_USER = 'SELECT id, remote_id, value, display FROM event_category WHERE account_id IS NOT NULL';
export const SELECT_EVENT_CATEGORIES_FOR_PROFILE_USER = 'SELECT id, remote_id, value, display FROM event_category WHERE (profile_id LIKE ? OR profile_id LIKE ? OR profile_id LIKE ? OR profile_id = ?)';
export const SELECT_EVENT_TYPES_BY_CATEGORY = 'SELECT * FROM event_type WHERE category_id = ?';
export const SELECT_EVENT_TYPES_BY_CATEGORY_AND_DISPLAY = 'SELECT * FROM event_type WHERE category_id = ? AND display LIKE ?';
export const SELECT_EVENT_TYPES_BY_DISPLAY_USER = 'SELECT id, display, schema, geometry_type, icon_svg, default_priority, value FROM event_type JOIN (SELECT remote_id FROM event_category WHERE ( ? )) as category on category.remote_id = event_type.category_id WHERE display LIKE ? AND account_id IS NOT NULL';
export const SELECT_EVENT_TYPES_BY_DISPLAY_PROFILE = 'SELECT id, display, schema, geometry_type, icon_svg, default_priority, value FROM event_type JOIN (SELECT remote_id FROM event_category WHERE ( ? )) as category on category.remote_id = event_type.category_id WHERE display LIKE ? AND (profile_id LIKE ? OR profile_id LIKE ? OR profile_id LIKE ? OR profile_id = ?)';
export const SELECT_EVENT_TYPE = 'SELECT * FROM event_type';
export const SELECT_EVENT_TYPE_FOR_PARENT_USER = 'SELECT * FROM event_type JOIN (SELECT remote_id FROM event_category WHERE ( ? )) as category on category.remote_id = event_type.category_id WHERE account_id IS NOT NULL';
export const SELECT_EVENT_TYPE_FOR_PROFILE_USER = 'SELECT * FROM event_type JOIN (SELECT remote_id FROM event_category WHERE ( ? )) as category on category.remote_id = event_type.category_id WHERE (profile_id LIKE ? OR profile_id LIKE ? OR profile_id LIKE ? OR profile_id = ?)';
export const SELECT_EVENT_TYPE_PROFILE_BY_VALUE = 'SELECT profile_id, value FROM event_type WHERE value = ?';
export const SELECT_EVENT_TYPE_DISPLAY_BY_VALUE = 'SELECT display FROM event_type WHERE value = ?';
export const SELECT_DEFAULT_EVENT_TYPE_BY_VALUE = 'SELECT id, display, schema, geometry_type  FROM event_type WHERE value = ?';
export const SELECT_DEFAULT_EVENT_TYPE_FOR_PARENT_USER = 'SELECT display, value FROM event_type WHERE account_id = 1 LIMIT 1';
export const SELECT_DEFAULT_EVENT_TYPE_FOR_PROFILE_USER = 'SELECT display, value FROM event_type WHERE (profile_id LIKE ? OR profile_id LIKE ? OR profile_id LIKE ? OR profile_id = ?) LIMIT 1';
export const SELECT_EVENTS_PENDING_SYNC = 'SELECT events.*, event_type.value, event_type.geometry_type, patrol_segments.remote_id AS segment_remote_id FROM events JOIN event_type ON events.event_type_id = event_type.id LEFT JOIN patrol_segments ON events.patrol_segment_id = patrol_segments.id WHERE events.account_id = ? AND events.is_draft = 0 AND events.remote_id IS NULL';
export const SELECT_DRAFT_EVENTS_PROFILE = 'SELECT events.id, events.title, event_type.id AS type_id, events.updated_at, event_type.icon_svg, event_type.default_priority, event_type.schema, event_type.geometry_type FROM events JOIN event_type ON events.event_type_id = event_type.id WHERE events.is_draft = 1 AND events.profile_id = ? ORDER BY events.updated_at DESC';
export const SELECT_DRAFT_EVENTS_USER = 'SELECT events.id, events.title, event_type.id AS type_id, events.updated_at, event_type.icon_svg, event_type.default_priority, event_type.schema, event_type.geometry_type FROM events JOIN event_type ON events.event_type_id = event_type.id WHERE events.is_draft = 1 AND events.profile_id IS NULL ORDER BY events.updated_at DESC';
export const SELECT_EVENT_PENDING_SYNC = 'SELECT events.id, events.title, event_type.id AS type_id, events.updated_at, event_type.icon_svg, event_type.default_priority, event_type.schema, event_type.geometry_type FROM events JOIN event_type ON events.event_type_id = event_type.id WHERE events.is_draft = 0 AND events.remote_id IS NULL AND events.id = ?';
export const SELECT_EVENT_PENDING_SYNC_OR_DRAFT = 'SELECT events.id, events.title, events.is_draft, event_type.id AS type_id, events.updated_at, event_type.icon_svg, event_type.default_priority, event_type.schema, event_type.geometry_type FROM events JOIN event_type ON events.event_type_id = event_type.id WHERE events.remote_id IS NULL AND events.id = ?';
export const SELECT_EVENT_BY_ID = 'SELECT * FROM events WHERE id = ? AND account_id = ?';
export const SELECT_ATTACHMENTS_BY_ID = 'SELECT * FROM attachments WHERE event_id = ? AND account_id = ?';
export const SELECT_EVENTS_ATTACHMENTS_PENDING_SYNC = 'SELECT events.remote_id AS event_id, events.account_id AS account_id, events.profile_id AS profile_id, attachments.id AS attachment_id, attachments.path, attachments.type, attachments.note_text FROM events JOIN attachments ON events.id = attachments.event_id WHERE events.remote_id IS NOT NULL AND attachments.uploaded = 0';
export const SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_COUNT_USER = 'SELECT COUNT(DISTINCT events.id) AS count FROM events LEFT JOIN attachments ON events.id = attachments.event_id WHERE (events.remote_id IS NULL OR attachments.uploaded = 0) AND events.is_draft = 0 AND events.profile_id IS NULL';
export const SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_COUNT_PROFILE = 'SELECT COUNT(DISTINCT events.id) AS count FROM events LEFT JOIN attachments ON events.id = attachments.event_id WHERE (events.remote_id IS NULL OR attachments.uploaded = 0) AND events.is_draft = 0 AND events.profile_id = ?';
export const SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_PROFILE = 'SELECT DISTINCT events.id AS event_id, events.state AS event_state, events.title AS event_title, events.remote_id AS event_remote_id FROM events LEFT JOIN attachments ON events.id = attachments.event_id WHERE (events.remote_id IS NULL OR attachments.uploaded = 0) AND events.is_draft = 0 AND events.profile_id = ?';
export const SELECT_EVENTS_AND_ATTACHMENTS_PENDING_SYNC_USER = 'SELECT DISTINCT events.id AS event_id, events.state AS event_state, events.title AS event_title, events.remote_id AS event_remote_id FROM events LEFT JOIN attachments ON events.id = attachments.event_id WHERE (events.remote_id IS NULL OR attachments.uploaded = 0) AND events.is_draft = 0 AND events.profile_id IS NULL';
export const SELECT_EVENTS_FOR_PARENT_USER = 'SELECT DISTINCT events.id, events.remote_id, events.title, events.created_at, events.updated_at, events.is_draft, events.state, event_type.icon_svg, event_type.default_priority FROM events LEFT JOIN attachments ON events.id = attachments.event_id JOIN event_type ON events.event_type_id = event_type.id JOIN (SELECT remote_id FROM event_category WHERE ( ? )) as category ON category.remote_id = event_type.category_id WHERE ( ( ? ) ) ORDER BY events.updated_at DESC';
export const SELECT_EVENTS_FOR_PROFILE_USER = 'SELECT DISTINCT events.id, events.remote_id, events.title, events.created_at, events.updated_at, events.is_draft, events.state, event_type.icon_svg, event_type.default_priority FROM events LEFT JOIN attachments ON events.id = attachments.event_id JOIN event_type ON events.event_type_id = event_type.id JOIN (SELECT remote_id FROM event_category WHERE ( ? )) as category ON category.remote_id = event_type.category_id WHERE ( ( ? ) ) ORDER BY events.updated_at DESC';
export const SELECT_NUMBER_OF_REPORTS_DRAFTS_PROFILE = 'SELECT COUNT(*) FROM events WHERE events.is_draft = 1 AND events.profile_id = ?';
export const SELECT_NUMBER_OF_REPORTS_DRAFTS_USER = 'SELECT COUNT(*) FROM events WHERE events.is_draft = 1 AND events.profile_id IS NULL';
export const SELECT_SYNC_STATE = 'SELECT * FROM sync_states WHERE resource = ?';
export const SELECT_PATROL_TYPES_BY_USER = 'SELECT * FROM patrol_types WHERE account_id = ? AND is_active = 1 ORDER BY ordernum ASC';
export const SELECT_PATROL_BY_ID = 'SELECT * FROM patrols WHERE id = ?';
export const SELECT_PATROL_SEGMENTS_AND_PATROL_TYPE_BY_ID = 'SELECT patrol_segments.*, patrol_types.value AS patrol_type FROM patrol_segments JOIN patrol_types on patrol_segments.patrol_type_id = patrol_types.id WHERE patrol_id = ?';
export const SELECT_PATROL_DETAILS_BY_PATROL_ID = 'SELECT patrols.remote_id, patrols.title, patrols.serial_number, patrol_segments.start_latitude, patrol_segments.start_longitude, patrol_segments.start_time, patrol_types.value AS patrol_type, patrol_types.icon_svg, patrols.created_at FROM patrols JOIN patrol_segments ON patrols.id = patrol_segments.patrol_id JOIN patrol_types ON patrol_segments.patrol_type_id = patrol_types.id WHERE patrol_id = ?';
export const SELECT_PENDING_SYNC_PATROLS = 'SELECT * FROM patrols WHERE remote_id IS NULL AND state <> \'unauthorized\' OR (state = \'open\' AND updated_at IS NOT NULL)';
export const SELECT_PENDING_SYNC_PATROLS_COUNT_USER = 'SELECT COUNT(*) AS count FROM patrols WHERE profile_id IS NULL AND state = \'open\' AND ((remote_id IS NULL) OR (remote_id IS NOT NULL AND updated_at IS NOT NULL))';
export const SELECT_PENDING_SYNC_PATROLS_COUNT_PROFILE = 'SELECT COUNT(*) AS count FROM patrols WHERE profile_id = ? AND state = \'open\' AND ((remote_id IS NULL) OR (remote_id IS NOT NULL AND updated_at IS NOT NULL))';
export const SELECT_SYNCED_PATROLS = 'SELECT * FROM patrols WHERE remote_id IS NOT NULL AND state = \'done\'';
export const SELECT_ACTIVE_PATROL = 'SELECT patrols.id AS patrol_id, patrol_segments.id AS patrol_segments_id FROM patrols JOIN patrol_segments ON patrols.id = patrol_segments.patrol_id WHERE state = \'open\' AND updated_at IS NULL LIMIT 1';
export const SELECT_ACTIVE_PATROL_SEGMENT_ID = 'SELECT patrol_segments.id  FROM patrols JOIN patrol_segments on patrols.id = patrol_segments.patrol_id WHERE state IS \'open\' AND updated_at IS NULL LIMIT 1';
export const SELECT_UPLOADED_REPORTS = 'SELECT id FROM events WHERE events.remote_id IS NOT NULL AND events.is_draft = 0 AND account_id = ?;';
export const SELECT_USER_PATROL_PERMISSIONS = 'SELECT permissions FROM accounts_user WHERE id = ?';
export const SELECT_PROFILE_PATROL_PERMISSIONS = 'SELECT permissions FROM user_profiles WHERE id = ?';
