export const DROP_INDEX_PATROL_TYPES_IDX = 'DROP INDEX IF EXISTS patrol_types_id_idx';
export const ADD_INDEX_PATROL_TYPES_IDX = 'CREATE UNIQUE INDEX IF NOT EXISTS patrol_types_id_idx ON patrol_types (remote_id)';
