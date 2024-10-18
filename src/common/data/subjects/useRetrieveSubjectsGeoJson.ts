// External Dependencies
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useCallback } from 'react';

// Internal Dependencies
import { logSQL } from '../../utils/logUtils';
import { SELECT_PROFILE_SUBJECTS_GEO_JSON, SELECT_SUBJECTS_GEO_JSON } from '../sql/subjectQueries';
import { useGetDBConnection } from '../PersistentStore';
import { useRetrieveData } from '../hooks/useRetrieveData';
import { bindQueryParams } from '../../utils/dataBaseUtils';

export const useRetrieveSubjectsGeoJson = () => {
  // Hooks
  const { getDBInstance } = useGetDBConnection();
  const { retrieveData } = useRetrieveData();

  const retrieveSubjectsGeoJson = useCallback(async (
    visibleSubjects: string[],
    profile_id?: number,
  ): Promise<GeoJSON.FeatureCollection | null> => {
    if (visibleSubjects.length === 0) {
      return null;
    }

    let dbInstance: SQLiteDatabase | null = null;
    let subjectsGeoJSON: GeoJSON.FeatureCollection | null = null;

    try {
      dbInstance = await getDBInstance();

      if (dbInstance) {
        const query = profile_id ? SELECT_PROFILE_SUBJECTS_GEO_JSON : SELECT_SUBJECTS_GEO_JSON;
        const params = profile_id ? [profile_id, visibleSubjects] : [visibleSubjects];

        const subjectsGeoJSONRaw = await retrieveData(
          dbInstance,
          bindQueryParams(query, params),
          [],
        );

        if (subjectsGeoJSONRaw && subjectsGeoJSONRaw[0].rows.length === 1) {
          subjectsGeoJSON = JSON.parse(subjectsGeoJSONRaw[0].rows.item(0).geojsonData);
        }
      }
    } catch (error) {
      logSQL.error('Subject GeoJSON not retrieved from local database. Error ->', error);
      if (error instanceof Error) {
        throw Error(error.message);
      } else if (typeof error === 'string') {
        throw Error(error);
      }
    }

    return subjectsGeoJSON;
  }, []);

  return { retrieveSubjectsGeoJson };
};
