/* eslint-disable no-await-in-loop */
// External Dependencies
import { useCallback } from 'react';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

// Internal Dependencies
import log, { logGeneral } from '../../utils/logUtils';
import { OBSERVATION_DISTANCE_THRESHOLD_METERS } from '../../utils/locationUtils';

export const useGetLocation = () => {
  const getLocationWithRetries = useCallback(async (
    notifyAttempts?: (location: GeoPosition) => void,
  ) => {
    let attempts = 0;
    let interval = 0;
    let bestLocation: GeoPosition;

    while (attempts < 3) {
      try {
        const location = await getLocation();
        logGeneral.info(`[getLocationWithRetries] attempt ${attempts + 1}: ${location.coords.latitude}, ${location.coords.longitude} accuracy ${location.coords.accuracy}`);

        if (location.coords.accuracy <= 4) {
          return location;
        }

        // @ts-ignore
        if (bestLocation) {
          if (location.coords.accuracy < bestLocation.coords.accuracy) {
            bestLocation = location;
            notifyAttempts?.(location);
          }
        } else {
          bestLocation = location;
          notifyAttempts?.(location);
        }
      } finally {
        interval = 2 * (attempts) * 1000;
        attempts += 1;
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        await new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      }
    }

    // @ts-ignore
    if (bestLocation) {
      return bestLocation;
    }

    throw Error('Could not get location with retries');
  }, []);

  const getLocation = useCallback(async () => new Promise<GeoPosition>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        log.error(`[useGetLocation] - Get current position - ${JSON.stringify(error)}`);
        reject();
      },
      highAccuracyOptions,
    );
  }), []);

  const highAccuracyOptions = {
    enableHighAccuracy: true,
    distanceFilter: OBSERVATION_DISTANCE_THRESHOLD_METERS,
    maximumAge: 1000,
  };

  return { getLocationWithRetries };
};
