// Internal Dependencies
import BackgroundLocation from '../backgrounGeolocation/BackgroundLocation';

export const syncPendingObservations = async () => {
  const pendingObservations = await BackgroundLocation.getCount();
  if (pendingObservations > 0) {
    await BackgroundLocation.sync();
  }
};
