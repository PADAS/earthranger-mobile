// External Dependencies
import { useCallback } from 'react';

// Internal Dependencies
import { SELECT_PATROL_SEGMENTS_AND_PATROL_TYPE_BY_ID } from '../sql/queries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { PersistedPatrolTypeSegment } from '../../types/types';

export const useRetrievePatrolTypeSegmentByPatrolId = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrievePatrolTypeSegmentByPatrolId = useCallback(async (patrolId: string) => {
    // Get database connection instance
    const dbInstance = await getDBInstance();

    if (dbInstance) {
      // Get information from the local database
      const segments = await retrieveData(
        dbInstance,
        SELECT_PATROL_SEGMENTS_AND_PATROL_TYPE_BY_ID,
        [patrolId],
      );
      const segmentsList: PersistedPatrolTypeSegment[] = [];

      if (segments && segments.length > 0) {
        for (let i = 0, l = segments[0].rows.length; i < l; i++) {
          segmentsList.push({
            id: segments[0].rows.item(i).id,
            remote_id: segments[0].rows.item(i).remote_id,
            patrol_id: segments[0].rows.item(i).patrol_id,
            patrol_type_id: segments[0].rows.item(i).patrol_type_id,
            start_latitude: segments[0].rows.item(i)?.start_latitude?.toString(),
            start_longitude: segments[0].rows.item(i)?.start_longitude?.toString(),
            stop_latitude: segments[0].rows.item(i)?.stop_latitude?.toString(),
            stop_longitude: segments[0].rows.item(i)?.stop_longitude?.toString(),
            start_time: segments[0].rows.item(i)?.start_time?.toString(),
            end_time: segments[0].rows.item(i)?.end_time?.toString(),
            patrol_type: segments[0].rows.item(i).patrol_type,
          });
        }
      }
      return segmentsList;
    }

    return [];
  }, []);

  return { retrievePatrolTypeSegmentByPatrolId };
};
