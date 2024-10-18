// External Dependencies
import MapboxGL from '@react-native-mapbox-gl/maps';
import { isEqual } from 'lodash-es';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';
import { LatLon as LatLon_Utm } from 'geodesy/utm';
import { LatLon as Latlon_Utm_Mgrs } from 'geodesy/mgrs';
import { point, Units } from '@turf/helpers';
import distance from '@turf/distance';

// Internal Dependencies
import BackgroundLocation from '../backgrounGeolocation/BackgroundLocation';
import { Position } from '../types/types';

// ------------------------------------------------------------------------
// internals
// ------------------------------------------------------------------------

const LNG_LAT_DECIMAL_PRECISION = 5;

let mapUserLocation: MapboxGL.Location | undefined;

// ------------------------------------------------------------------------
// public enum
// ------------------------------------------------------------------------

export enum LocationFormats {
  DEG = 'DEG',
  DMS = 'DMS',
  DDM = 'DDM',
  UTM = 'UTM',
  MGRS = 'MGRS',
}

// ------------------------------------------------------------------------
// public constants
// ------------------------------------------------------------------------

export const OBSERVATION_DISTANCE_THRESHOLD_METERS = 25;
export const nullIslandLocation: Position = [0, 0];

// ------------------------------------------------------------------------
// public functions
// ------------------------------------------------------------------------

export const formatCoordinates = (
  latitude: number,
  longitude: number,
  gpsFormat: string | undefined,
) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  const position = new LatLon(lat, lng);

  if (position) {
    switch (gpsFormat) {
      case LocationFormats.DEG:
        return position.toString('n', LNG_LAT_DECIMAL_PRECISION).split(',').map((item) => item.concat('°')).join(', ');

      case LocationFormats.DMS:
        return position.toString('dms', LNG_LAT_DECIMAL_PRECISION);

      case LocationFormats.DDM:
        return position.toString('dm', LNG_LAT_DECIMAL_PRECISION);

      case LocationFormats.UTM: {
        const posUtm = new LatLon_Utm(lat, lng).toUtm();
        return posUtm.toString();
      }

      case LocationFormats.MGRS: {
        const posMgrs = new Latlon_Utm_Mgrs(lat, lng).toUtm().toMgrs();
        return posMgrs.toString();
      }

      default:
        break;
    }
  }
  return '';
};

export const getMapUserPosition = () => (mapUserLocation ? [
  mapUserLocation?.coords.longitude,
  mapUserLocation?.coords.latitude,
] : [0, 0]);

export const isObservationPendingData = async () => {
  const pendingObservations = await BackgroundLocation.getCount();
  return pendingObservations > 0;
};

export const isNullIslandPosition = (position: Position) => isEqual(position, nullIslandLocation);

export const isValidObservationThreshold = (
  from: Position,
  to: Position,
  threshold: number = OBSERVATION_DISTANCE_THRESHOLD_METERS,
) => {
  if (isNullIslandPosition(from)) {
    return true;
  }
  const fromPoint = point(from);
  const toPoint = point(to);
  const options: { units: Units } = { units: 'meters' };
  return distance(fromPoint, toPoint, options) > threshold;
};

export const isValidObservationAccuracy = (
  accuracy: number,
  threshold: number = OBSERVATION_DISTANCE_THRESHOLD_METERS,
) => accuracy < threshold;

export const setMapUserLocation = (location: MapboxGL.Location) => {
  mapUserLocation = location;
};

export const removeDBLocations = async () => {
  const hasLocations = await isObservationPendingData();
  if (hasLocations) {
    await BackgroundLocation.destroyLocations();
  }
};
