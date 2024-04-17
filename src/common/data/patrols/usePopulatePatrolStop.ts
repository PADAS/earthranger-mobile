// External Dependencies
import { useCallback } from 'react';
import dayjs from 'dayjs';

// Internal Dependencies
import { useGetDBConnection } from '../PersistentStore';
import { useInsertData } from '../hooks/useInsertData';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { SELECT_ACTIVE_PATROL, UPDATE_PATROL_SEGMENT_STOP, UPDATE_PATROL_STOP } from '../sql/queries';
import { logSQL } from '../../utils/logUtils';

export const usePopulatePatrolStop = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { insertData } = useInsertData();
  const { retrieveData } = useRetrieveData();

  const populatePatrolStop = useCallback(async (
    stopLatitude: string,
    stopLongitude: string,
  ) => {
    try {
      // Get database connection instance
      const dbInstance = await getDBInstance();

      const currentTimestamp = dayjs().format();

      if (dbInstance) {
        const activePatrol = await retrieveData(
          dbInstance,
          SELECT_ACTIVE_PATROL,
          [],
        );

        if (activePatrol && activePatrol.length > 0) {
          const activePatrolId = activePatrol[0].rows.item(0).patrol_id.toString();
          const activePatrolSegmentId = activePatrol[0].rows.item(0).patrol_segments_id.toString();

          if (activePatrolId && activePatrolSegmentId) {
            // Update patrol
            await insertData(
              dbInstance,
              UPDATE_PATROL_STOP,
              [currentTimestamp, activePatrolId],
            );

            // Update patrol_segments
            await insertData(
              dbInstance,
              UPDATE_PATROL_SEGMENT_STOP,
              [
                stopLatitude !== '0' ? stopLatitude : null,
                stopLongitude !== '0' ? stopLongitude : null,
                currentTimestamp,
                activePatrolSegmentId,
              ],
            );
          }
        }
      }
      logSQL.debug('[usePopulatePatrolStop]: Database Updated');
    } catch (error) {
      logSQL.error('[usePopulatePatrolStop] - insertData: error', error);
    }
  }, []);

  return { populatePatrolStop };
};
