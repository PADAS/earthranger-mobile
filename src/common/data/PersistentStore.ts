// External Dependencies
import { useCallback } from 'react';
import { enablePromise, openDatabase, deleteDatabase } from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

// Internal Dependencies
import {
  TABLE_ACCOUNTS_USER,
  TABLE_ATTACHMENTS,
  TABLE_EVENT_CATEGORY,
  TABLE_EVENT_TYPE,
  TABLE_EVENTS,
  TABLE_SYNC_STATES,
  DB_USER_VERSION,
  DB_VERSION_UPDATE,
  TABLE_PATROL_TYPES,
  TABLE_PATROLS,
  TABLE_PATROL_SEGMENTS,
  TABLE_USER_PROFILES,
  TABLE_USER_SUBJECTS,
  TABLE_SUBJECTS,
  TABLE_SUBJECT_GROUPS,
  TABLE_SUBJECT_GROUP_MEMBERSHIPS,
  TABLE_PROFILE_SUBJECT_GROUPS,
} from './sql/tables';
import {
  ATTACHMENTS_IDX,
  EVENTS_IDX,
  EVENT_CATEGORY_IDX,
  EVENT_TYPE_IDX,
  EVENT_TYPE_DISPLAY_IDX,
  SYNC_STATES_IDX, SELECT_SYNC_STATE,
  PATROL_TYPES_IDX,
} from './sql/queries';
import {
  ACCOUNTS_USER_IDX,
  SELECT_USER_BY_USERNAME,
  USER_PROFILES_IDX,
  USER_SUBJECTS_IDX,
} from './sql/userQueries';
import { logSQL } from '../utils/logUtils';
import { DATABASE_FILE_NAME, IS_IOS, USER_ID_KEY } from '../constants/constants';
import { setSecuredStringForKey } from './storage/utils';

// Migrations
import { ALTER_TABLE_EVENT_TYPE_GEOMETRY } from './sql/migrations/db_m_001';
import { ALTER_TABLE_ACCOUNT_USER_CONTENT_TYPE, ALTER_TABLE_ACCOUNT_USER_REPORTED_BY } from './sql/migrations/db_m_002';
import { ALTER_TABLE_EVENTS_GEOMETRY } from './sql/migrations/db_m_003';
import {
  ALTER_TABLE_EVENT_TYPE, DROP_TABLE_EVENT_TYPE,
  DROP_TABLE_EVENT_TYPE_TEMP,
  INSERT_TABLE_EVENT_TYPE_TEMP,
  TABLE_EVENT_TYPE_TEMP,
} from './sql/migrations/db_m_004';
import {
  ALTER_TABLE_EVENT_CATEGORY,
  DROP_TABLE_EVENT_CATEGORY,
  DROP_TABLE_EVENT_CATEGORY_TEMP,
  INSERT_TABLE_EVENT_CATEGORY_TEMP,
  TABLE_EVENT_CATEGORY_TEMP,
} from './sql/migrations/db_m_005';
import { M_TABLE_SYNC_STATES } from './sql/migrations/db_m_006';
import { M_TABLE_PATROL_TYPES } from './sql/migrations/db_m_007';
import { ADD_INDEX_PATROL_TYPES_IDX, DROP_INDEX_PATROL_TYPES_IDX } from './sql/migrations/db_m_008';
import { DROP_TABLE_CHOICES } from './sql/migrations/db_m_009';
import { M_TABLE_PATROLS, M_TABLE_PATROL_SEGMENTS } from './sql/migrations/db_m_010';
import { ALTER_TABLE_ACCOUNT_USER_SUBJECT_ID } from './sql/migrations/db_m_011';
import { ALTER_TABLE_ACCOUNT_USER_ACCEPTED_EULA } from './sql/migrations/db_m_012';
import { M_TABLE_USER_PROFILES } from './sql/migrations/db_m_013';
import { ALTER_TABLE_EVENTS_PATROL_SEGMENT_ID } from './sql/migrations/db_m_014';
import { ALTER_TABLE_USER_PROFILE_PIN } from './sql/migrations/db_m_015';
import {
  ALTER_TABLE_ATTACHMENTS_PROFILE_ID,
  ALTER_TABLE_EVENTS_PROFILE_ID,
  ALTER_TABLE_EVENT_CATEGORY_PROFILE_ID,
  ALTER_TABLE_EVENT_TYPE_PROFILE_ID,
  ALTER_TABLE_PATROL_TYPES_PROFILE_ID,
} from './sql/migrations/db_m_016';
import { ALTER_TABLE_ACCOUNTS_USER_PIN } from './sql/migrations/db_m_017';
import { M_TABLE_USER_SUBJECTS } from './sql/migrations/db_m_018';
import { ALTER_TABLE_PATROL_TYPE_ORDERNUM } from './sql/migrations/db_m_019';
import {
  ALTER_TABLE_ACCOUNTS_USER, ALTER_TABLE_USER_PROFILES,
  DROP_TABLE_ACCOUNTS_USER,
  DROP_TABLE_ACCOUNTS_USER_TEMP, DROP_TABLE_USER_PROFILES,
  DROP_TABLE_USER_PROFILES_TEMP,
  INSERT_TABLE_ACCOUNTS_USER_TEMP,
  INSERT_TABLE_USER_PROFILES_TEMP,
  TABLE_ACCOUNTS_USER_TEMP,
  TABLE_USER_PROFILES_TEMP,
} from './sql/migrations/db_m_020';
import {
  ADD_INDEX_ACCOUNTS_USER_IDX, ADD_INDEX_USER_PROFILES_IDX,
  DROP_INDEX_ACCOUNTS_USER_IDX,
  DROP_INDEX_USER_PROFILES_IDX,
} from './sql/migrations/db_m_021';
import { ALTER_TABLE_EVENTS_STATE } from './sql/migrations/db_m_022';
import {
  ALTER_TABLE_EVENTS,
  DROP_TABLE_EVENTS,
  DROP_TABLE_EVENTS_TEMP,
  INSERT_TABLE_EVENTS_TEMP,
  TABLE_EVENTS_TEMP,
} from './sql/migrations/db_m_023';
import {
  ALTER_TABLE_ATTACHMENTS,
  ALTER_TABLE_PATROL_TYPES,
  DROP_TABLE_ATTACHMENTS,
  DROP_TABLE_ATTACHMENTS_TEMP,
  DROP_TABLE_PATROL_TYPES,
  DROP_TABLE_PATROL_TYPES_TEMP,
  INSERT_TABLE_ATTACHMENTS_TEMP,
  INSERT_TABLE_EVENT_CATEGORY_TEMP_M24,
  INSERT_TABLE_EVENT_TYPE_TEMP_M24,
  INSERT_TABLE_PATROL_TYPES_TEMP,
  TABLE_ATTACHMENTS_TEMP,
  TABLE_EVENT_CATEGORY_TEMP_M24,
  TABLE_EVENT_TYPE_TEMP_M24,
  TABLE_PATROL_TYPES_TEMP,
} from './sql/migrations/db_m_024';
import {
  ALTER_TABLE_PATROLS_ACCOUNT_ID,
  ALTER_TABLE_PATROLS_PROFILE_ID,
} from './sql/migrations/db_m_025';
import {
  ALTER_TABLE_ACCOUNTS_USER_PERMISSIONS,
  ALTER_TABLE_USER_PROFILES_PERMISSIONS,
} from './sql/migrations/db_m_026';
import {
  ALTER_TABLE_EVENT_TYPE_M27,
  DROP_TABLE_EVENT_TYPE_M27,
  DROP_TABLE_EVENT_TYPE_TEMP_M27,
  INSERT_TABLE_EVENT_TYPE_TEMP_M27,
  TABLE_EVENT_TYPE_TEMP_M27,
} from './sql/migrations/db_m_027';
import { DROP_TABLE_DEVICES } from './sql/migrations/db_m_028';
import { ALTER_TABLE_PATROLS_SERIAL_NUMBER } from './sql/migrations/db_m_029';
import { ALTER_TABLE_ACCOUNTS_USER_IS_SUPERUSER } from './sql/migrations/db_m_030';
import { ALTER_TABLE_EVENTS_SERIAL_NUMBER } from './sql/migrations/db_m_031';
import { ALTER_TABLE_EVENT_TYPE_IS_ACTIVE } from './sql/migrations/db_m_032';
import { ALTER_TABLE_EVENT_CATEGORY_IS_ACTIVE } from './sql/migrations/db_m_033';
import {
  ADD_INDEX_SUBJECT_GROUPS_IDX,
  ADD_INDEX_SUBJECT_IDX,
  DROP_INDEX_SUBJECT_GROUPS_IDX,
  DROP_INDEX_SUBJECT_IDX,
  TABLE_SUBJECTS_M,
  TABLE_SUBJECT_GROUPS_M,
} from './sql/migrations/db_m_034';
import {
  M_ALTER_TABLE_SUBJECTS_TEMP,
  M_ALTER_TABLE_SUBJECT_GROUPS,
  M_DROP_SUBJECTS_TEMP,
  M_DROP_TABLE_SUBJECTS,
  M_INSERT_TABLE_SUBJECTS_TEMP,
  M_TABLE_SUBJECTS_TEMP,
  M_TABLE_SUBJECT_GROUP_MEMBERSHIPS,
} from './sql/migrations/db_m_035';
import { ALTER_TABLE_SUBJECTS_ICON_SVG } from './sql/migrations/db_m_036';
import {
  ALTER_TABLE_SUBJECT_GROUPS,
  DROP_TABLE_SUBJECT_GROUPS,
  DROP_TABLE_SUBJECT_GROUPS_TEMP,
  INSERT_TABLE_SUBJECT_GROUPS_TEMP,
  M_37_PROFILE_SUBJECT_GROUPS_PROFILE_ID_IDX,
  M_37_PROFILE_SUBJECT_GROUPS_SUBJECT_GROUP_ID_IDX,
  M_37_SUBJECT_GROUPS_ID_IDX,
  M_37_SUBJECT_GROUPS_PARENT_ID_IDX,
  M_37_TABLE_PROFILE_SUBJECT_GROUPS,
  TABLE_SUBJECT_GROUPS_TEMP,
} from './sql/migrations/db_m_037';
import {
  PROFILE_SUBJECT_GROUPS_PROFILE_ID_IDX,
  PROFILE_SUBJECT_GROUPS_SUBJECT_GROUP_ID_IDX,
  SUBJECTS_IDX,
  SUBJECT_GROUPS_IDX,
  SUBJECT_GROUPS_ID_IDX,
  SUBJECT_GROUPS_PARENT_ID_IDX,
} from './sql/subjectQueries';
import {
  M_38_DROP_SUBJECT_GROUPS_ID_IDX,
  M_38_DROP_TABLE_SUBJECT_GROUPS,
  M_38_SUBJECT_GROUPS_ID_IDX,
  M_38_TABLE_SUBJECT_GROUPS,
} from './sql/migrations/db_m_038';
import { ALTER_TABLE_SUBJECTS_REMOTE_ID_IDX } from './sql/migrations/db_m_039';

enablePromise(true);

// ------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------

const getDBConnection = async () => openDatabase({ name: DATABASE_FILE_NAME, location: 'default' });
const dbPath = (IS_IOS) ? `${RNFS.LibraryDirectoryPath}/LocalDatabase/${DATABASE_FILE_NAME}`
  : `/data/data/com.earthranger.debug/databases/${DATABASE_FILE_NAME}`;

// ------------------------------------------------------------------------
// Hooks
// ------------------------------------------------------------------------

export const useInitDatabase = () => {
  const initDatabase = useCallback(async () => {
    try {
      const db = await getDBConnection();
      logSQL.debug(`Database installed ${dbPath}`);
      await db.executeSql('PRAGMA foreign_keys = ON');
      // create accounts_user table and index
      await db.executeSql(TABLE_ACCOUNTS_USER);
      await db.executeSql(ACCOUNTS_USER_IDX);
      logSQL.debug('accounts_user table created');
      // create user_profiles table and index
      await db.executeSql(TABLE_USER_PROFILES);
      await db.executeSql(USER_PROFILES_IDX);
      logSQL.debug('user_profiles table created');
      // create user_subjects table and index
      await db.executeSql(TABLE_USER_SUBJECTS);
      await db.executeSql(USER_SUBJECTS_IDX);
      logSQL.debug('user_subjects table created');
      // create event_type table and index
      await db.executeSql(TABLE_EVENT_TYPE);
      await db.executeSql(EVENT_TYPE_IDX);
      await db.executeSql(EVENT_TYPE_DISPLAY_IDX);
      logSQL.debug('event_type table created');
      // create event_category table and index
      await db.executeSql(TABLE_EVENT_CATEGORY);
      await db.executeSql(EVENT_CATEGORY_IDX);
      logSQL.debug('event_category table created');
      // create events table and index
      await db.executeSql(TABLE_EVENTS);
      await db.executeSql(EVENTS_IDX);
      logSQL.debug('events table created');
      // create attachments table and index
      await db.executeSql(TABLE_ATTACHMENTS);
      await db.executeSql(ATTACHMENTS_IDX);
      logSQL.debug('attachments table created');
      // create sync_states table and index
      await db.executeSql(TABLE_SYNC_STATES);
      logSQL.debug('sync_states table created');
      // create patrol_types table and index
      await db.executeSql(TABLE_PATROL_TYPES);
      await db.executeSql(PATROL_TYPES_IDX);
      logSQL.debug('patrol_types table created');
      // create patrols and patrol_segments table
      await db.executeSql(TABLE_PATROLS);
      logSQL.debug('patrols table created');
      await db.executeSql(TABLE_PATROL_SEGMENTS);
      logSQL.debug('patrol_segments table created');
      // create subjects and subject_groups tables and indexes
      await db.executeSql(TABLE_SUBJECTS);
      await db.executeSql(SUBJECTS_IDX);
      logSQL.debug('subjects table created');
      await db.executeSql(TABLE_SUBJECT_GROUPS);
      await db.executeSql(SUBJECT_GROUPS_IDX);
      await db.executeSql(SUBJECT_GROUPS_ID_IDX);
      await db.executeSql(SUBJECT_GROUPS_PARENT_ID_IDX);
      logSQL.debug('subject_groups table created');
      await db.executeSql(TABLE_SUBJECT_GROUP_MEMBERSHIPS);
      logSQL.debug('subject_group_memberships table created');
      await db.executeSql(TABLE_PROFILE_SUBJECT_GROUPS);
      await db.executeSql(PROFILE_SUBJECT_GROUPS_PROFILE_ID_IDX);
      await db.executeSql(PROFILE_SUBJECT_GROUPS_SUBJECT_GROUP_ID_IDX);
      logSQL.debug('profile_subject_groups table created');
      // update db schema version
      await updateSchemaVersion();
      logSQL.debug(`db schema updated: version ${await getSchemaVersion()}`);
    } catch (error) {
      logSQL.error(`Database setup error: ${error}`);
    }
  }, []);

  return { initDatabase };
};

export const useGetDBConnection = () => {
  const getDBInstance = useCallback(async () => {
    let db = null;
    try {
      db = await getDBConnection();
    } catch (error) {
      logSQL.error(`[useGetDBConnection] - getDBInstance: error opening the database - ${error}`);
    }

    return db;
  }, []);

  return { getDBInstance };
};
export const useRemoveDB = () => {
  const removeDB = useCallback(async () => {
    try {
      if (IS_IOS) {
        // Close all connections to the database before removing it.
        const db = await getDBConnection();
        await db.close();
      }

      await deleteDatabase({ name: DATABASE_FILE_NAME, location: 'default' });
      logSQL.info(`${DATABASE_FILE_NAME} removed`);
    } catch (error: any) {
      logSQL.error(`Database delete error: ${error.toString()}`);
    }
  }, []);

  return { removeDB };
};

// ------------------------------------------------------------------------
// public functions
// ------------------------------------------------------------------------

export const getSchemaVersion = async () => {
  const db = await getDBConnection();
  const result = await db.executeSql(DB_USER_VERSION);

  if (result) {
    return result[0].rows.item(0).user_version;
  }
  return -1;
};

export const updateSchemaVersion = async () => {
  const db = await getDBConnection();
  if (db) {
    await db.executeSql(DB_VERSION_UPDATE);
  }
};

export const getSyncState = async (resource: string) => {
  const db = await getDBConnection();
  const result = await db.executeSql(SELECT_SYNC_STATE, [resource]);

  if (result && result[0].rows.item(0)) {
    return result[0].rows.item(0).state;
  }
  return -1;
};

export const setUserId = async (userName: string) => {
  try {
    const db = await getDBConnection();
    const result = await db.executeSql(SELECT_USER_BY_USERNAME, [userName]);
    if (result && result?.length > 0) {
      setSecuredStringForKey(USER_ID_KEY, result[0].rows.item(0).id.toString());
    }
  } catch (error) {
    logSQL.error('[setUserId] - setUserId: error setting user id', error);
  }
};

export const getUserRemoteId = async (userName: string) => {
  try {
    const db = await getDBConnection();
    const result = await db.executeSql(SELECT_USER_BY_USERNAME, [userName]);
    if (result[0].rows.length > 0) {
      return result[0].rows.item(0).remote_id;
    }
  } catch (error) {
    logSQL.debug(`sql error: ${JSON.stringify(error)}`);
    return -1;
  }
  return -1;
};

export const needsUpgrade = async (newVersion: number) => {
  const currentVersion = await getSchemaVersion();

  return newVersion > currentVersion;
};

// ------------------------------------------------------------------------
// migrations
// ------------------------------------------------------------------------

export const onUpgrade = async (newVersion: number) => {
  const currentVersion = await getSchemaVersion();
  logSQL.info(`Upgrading database from ${currentVersion} to ${newVersion} ...`);
  try {
    const db = await getDBConnection();

    switch (currentVersion) {
      case 1: // add geometry_type to event_type
        await db.executeSql(ALTER_TABLE_EVENT_TYPE_GEOMETRY);
      // falls through
      case 2: // add account_user reported by content
        await db.executeSql(ALTER_TABLE_ACCOUNT_USER_REPORTED_BY);
        await db.executeSql(ALTER_TABLE_ACCOUNT_USER_CONTENT_TYPE);
      // falls through
      case 3: // add events geojson
        await db.executeSql(ALTER_TABLE_EVENTS_GEOMETRY);
      // falls through
      case 4: // add unique remote_id to event_type for sync
        await db.executeSql(DROP_TABLE_EVENT_TYPE_TEMP);
        await db.executeSql(TABLE_EVENT_TYPE_TEMP);
        await db.executeSql(INSERT_TABLE_EVENT_TYPE_TEMP);
        await db.executeSql(DROP_TABLE_EVENT_TYPE);
        await db.executeSql(ALTER_TABLE_EVENT_TYPE);
        await db.executeSql(EVENT_TYPE_IDX);
      // falls through
      case 5: // add unique remote_id to event_category for sync
        await db.executeSql(DROP_TABLE_EVENT_CATEGORY_TEMP);
        await db.executeSql(TABLE_EVENT_CATEGORY_TEMP);
        await db.executeSql(INSERT_TABLE_EVENT_CATEGORY_TEMP);
        await db.executeSql(DROP_TABLE_EVENT_CATEGORY);
        await db.executeSql(ALTER_TABLE_EVENT_CATEGORY);
        await db.executeSql(EVENT_CATEGORY_IDX);
      // falls through
      case 6: // add sync_states table
        await db.executeSql(M_TABLE_SYNC_STATES);
        await db.executeSql(SYNC_STATES_IDX);
      // falls through
      case 7: // add patrol_types table
        await db.executeSql(M_TABLE_PATROL_TYPES);
        await db.executeSql(PATROL_TYPES_IDX);
      // falls through
      case 8: // add unique index to patrol types
        await db.executeSql(DROP_INDEX_PATROL_TYPES_IDX);
        await db.executeSql(ADD_INDEX_PATROL_TYPES_IDX);
      // falls through
      case 9: // drop choices table
        await db.executeSql(DROP_TABLE_CHOICES);
      // falls through
      case 10: // add patrols and patrol_segments tables
        await db.executeSql(M_TABLE_PATROLS);
        await db.executeSql(M_TABLE_PATROL_SEGMENTS);
      // falls through
      case 11: // add subject_id to accounts_user table
        await db.executeSql(ALTER_TABLE_ACCOUNT_USER_SUBJECT_ID);
      // falls through
      case 12: // add accepted_eula to accounts_user table
        await db.executeSql(ALTER_TABLE_ACCOUNT_USER_ACCEPTED_EULA);
      // falls through
      case 13: // add user_profiles table
        await db.executeSql(M_TABLE_USER_PROFILES);
        await db.executeSql(USER_PROFILES_IDX);
      // falls through
      case 14: // patrol_segment_id to events table
        await db.executeSql(ALTER_TABLE_EVENTS_PATROL_SEGMENT_ID);
      // falls through
      case 15: // pin to user profile table
        await db.executeSql(ALTER_TABLE_USER_PROFILE_PIN);
      // falls through
      case 16: // add profile_id to tables supporting account_id
        await db.executeSql(ALTER_TABLE_EVENT_CATEGORY_PROFILE_ID);
        await db.executeSql(ALTER_TABLE_EVENT_TYPE_PROFILE_ID);
        await db.executeSql(ALTER_TABLE_EVENTS_PROFILE_ID);
        await db.executeSql(ALTER_TABLE_ATTACHMENTS_PROFILE_ID);
        await db.executeSql(ALTER_TABLE_PATROL_TYPES_PROFILE_ID);
      // falls through
      case 17: // Add pin to account_users table
        await db.executeSql(ALTER_TABLE_ACCOUNTS_USER_PIN);
      // falls through
      case 18: // add user_subjects table
        await db.executeSql(M_TABLE_USER_SUBJECTS);
        await db.executeSql(USER_SUBJECTS_IDX);
      // falls through
      case 19: // add ordernum to patrol_types table
        await db.executeSql(ALTER_TABLE_PATROL_TYPE_ORDERNUM);
      // falls through
      case 20: // remove reported_by column from accounts_user and user_profiles tables
        await db.executeSql(DROP_TABLE_ACCOUNTS_USER_TEMP);
        await db.executeSql(TABLE_ACCOUNTS_USER_TEMP);
        await db.executeSql(INSERT_TABLE_ACCOUNTS_USER_TEMP);
        await db.executeSql(DROP_TABLE_ACCOUNTS_USER);
        await db.executeSql(ALTER_TABLE_ACCOUNTS_USER);
        await db.executeSql(ACCOUNTS_USER_IDX);

        await db.executeSql(DROP_TABLE_USER_PROFILES_TEMP);
        await db.executeSql(TABLE_USER_PROFILES_TEMP);
        await db.executeSql(INSERT_TABLE_USER_PROFILES_TEMP);
        await db.executeSql(DROP_TABLE_USER_PROFILES);
        await db.executeSql(ALTER_TABLE_USER_PROFILES);
        await db.executeSql(USER_PROFILES_IDX);
      // falls through
      case 21: // recreate index for accounts_user and user_profiles tables
        await db.executeSql(DROP_INDEX_ACCOUNTS_USER_IDX);
        await db.executeSql(ADD_INDEX_ACCOUNTS_USER_IDX);
        await db.executeSql(DROP_INDEX_USER_PROFILES_IDX);
        await db.executeSql(ADD_INDEX_USER_PROFILES_IDX);
      // falls through
      case 22: // add state column to events table
        await db.executeSql(ALTER_TABLE_EVENTS_STATE);
      // falls through
      case 23: // modify column profile_id from text to integer in events table
        await db.executeSql(DROP_TABLE_EVENTS_TEMP);
        await db.executeSql(TABLE_EVENTS_TEMP);
        await db.executeSql(INSERT_TABLE_EVENTS_TEMP);
        await db.executeSql(DROP_TABLE_EVENTS);
        await db.executeSql(ALTER_TABLE_EVENTS);
        await db.executeSql(EVENTS_IDX);
      // falls through
      case 24: // modify column profile_id from text to integer in event_type table
        await db.executeSql(DROP_TABLE_EVENT_TYPE_TEMP);
        await db.executeSql(TABLE_EVENT_TYPE_TEMP_M24);
        await db.executeSql(INSERT_TABLE_EVENT_TYPE_TEMP_M24);
        await db.executeSql(DROP_TABLE_EVENT_TYPE);
        await db.executeSql(ALTER_TABLE_EVENT_TYPE);
        await db.executeSql(EVENT_TYPE_IDX);

        await db.executeSql(DROP_TABLE_EVENT_CATEGORY_TEMP);
        await db.executeSql(TABLE_EVENT_CATEGORY_TEMP_M24);
        await db.executeSql(INSERT_TABLE_EVENT_CATEGORY_TEMP_M24);
        await db.executeSql(DROP_TABLE_EVENT_CATEGORY);
        await db.executeSql(ALTER_TABLE_EVENT_CATEGORY);
        await db.executeSql(EVENT_CATEGORY_IDX);

        await db.executeSql(DROP_TABLE_ATTACHMENTS_TEMP);
        await db.executeSql(TABLE_ATTACHMENTS_TEMP);
        await db.executeSql(INSERT_TABLE_ATTACHMENTS_TEMP);
        await db.executeSql(DROP_TABLE_ATTACHMENTS);
        await db.executeSql(ALTER_TABLE_ATTACHMENTS);
        await db.executeSql(ATTACHMENTS_IDX);

        await db.executeSql(DROP_TABLE_PATROL_TYPES_TEMP);
        await db.executeSql(TABLE_PATROL_TYPES_TEMP);
        await db.executeSql(INSERT_TABLE_PATROL_TYPES_TEMP);
        await db.executeSql(DROP_TABLE_PATROL_TYPES);
        await db.executeSql(ALTER_TABLE_PATROL_TYPES);
        await db.executeSql(PATROL_TYPES_IDX);
      // falls through
      case 25: // add account_id & profile_id to patrols table
        await db.executeSql(ALTER_TABLE_PATROLS_ACCOUNT_ID);
        await db.executeSql(ALTER_TABLE_PATROLS_PROFILE_ID);
      // falls through
      case 26: // add permissions to accounts_user & user_profiles
        await db.executeSql(ALTER_TABLE_ACCOUNTS_USER_PERMISSIONS);
        await db.executeSql(ALTER_TABLE_USER_PROFILES_PERMISSIONS);
      // falls through
      case 27:
        await db.executeSql(DROP_TABLE_EVENT_TYPE_TEMP_M27);
        await db.executeSql(TABLE_EVENT_TYPE_TEMP_M27);
        await db.executeSql(INSERT_TABLE_EVENT_TYPE_TEMP_M27);
        await db.executeSql(DROP_TABLE_EVENT_TYPE_M27);
        await db.executeSql(ALTER_TABLE_EVENT_TYPE_M27);
      // falls through
      case 28:
        await db.executeSql(DROP_TABLE_DEVICES);
      // falls through
      case 29:
        await db.executeSql(ALTER_TABLE_PATROLS_SERIAL_NUMBER);
      // falls through
      case 30:
        await db.executeSql(ALTER_TABLE_ACCOUNTS_USER_IS_SUPERUSER);
      // falls through
      case 31:
        await db.executeSql(ALTER_TABLE_EVENTS_SERIAL_NUMBER);
      // falls through
      case 32:
        await db.executeSql(ALTER_TABLE_EVENT_TYPE_IS_ACTIVE);
      // falls through
      case 33:
        await db.executeSql(ALTER_TABLE_EVENT_CATEGORY_IS_ACTIVE);
      // falls through
      case 34:
        await db.executeSql(TABLE_SUBJECTS_M);
        await db.executeSql(DROP_INDEX_SUBJECT_IDX);
        await db.executeSql(ADD_INDEX_SUBJECT_IDX);
        await db.executeSql(TABLE_SUBJECT_GROUPS_M);
        await db.executeSql(DROP_INDEX_SUBJECT_GROUPS_IDX);
        await db.executeSql(ADD_INDEX_SUBJECT_GROUPS_IDX);
      // falls through
      case 35:
        await db.executeSql(M_ALTER_TABLE_SUBJECT_GROUPS);
        await db.executeSql(M_DROP_SUBJECTS_TEMP);
        await db.executeSql(M_TABLE_SUBJECTS_TEMP);
        await db.executeSql(M_INSERT_TABLE_SUBJECTS_TEMP);
        await db.executeSql(M_DROP_TABLE_SUBJECTS);
        await db.executeSql(M_ALTER_TABLE_SUBJECTS_TEMP);
        await db.executeSql(M_TABLE_SUBJECT_GROUP_MEMBERSHIPS);
      // falls through
      case 36:
        await db.executeSql(ALTER_TABLE_SUBJECTS_ICON_SVG);
      // falls through
      case 37:
        await db.executeSql(DROP_TABLE_SUBJECT_GROUPS_TEMP);
        await db.executeSql(TABLE_SUBJECT_GROUPS_TEMP);
        await db.executeSql(INSERT_TABLE_SUBJECT_GROUPS_TEMP);
        await db.executeSql(DROP_TABLE_SUBJECT_GROUPS);
        await db.executeSql(ALTER_TABLE_SUBJECT_GROUPS);
        await db.executeSql(M_37_SUBJECT_GROUPS_ID_IDX);
        await db.executeSql(M_37_SUBJECT_GROUPS_PARENT_ID_IDX);
        await db.executeSql(M_37_TABLE_PROFILE_SUBJECT_GROUPS);
        await db.executeSql(M_37_PROFILE_SUBJECT_GROUPS_PROFILE_ID_IDX);
        await db.executeSql(M_37_PROFILE_SUBJECT_GROUPS_SUBJECT_GROUP_ID_IDX);
      // falls through
      case 38:
        await db.executeSql(M_38_DROP_SUBJECT_GROUPS_ID_IDX);
        await db.executeSql(M_38_DROP_TABLE_SUBJECT_GROUPS);
        await db.executeSql(M_38_TABLE_SUBJECT_GROUPS);
        await db.executeSql(M_38_SUBJECT_GROUPS_ID_IDX);
      // falls through
      case 39:
        await db.executeSql(ALTER_TABLE_SUBJECTS_REMOTE_ID_IDX);
      // falls through
      default:
        // Do nothing
        break;
    }

    // update db schema version
    await updateSchemaVersion();
    logSQL.debug(`db schema updated: version ${await getSchemaVersion()}`);
  } catch (error) {
    logSQL.error('[onUpgrade] - onUpgrade: error migrating db', error);
  }
};
