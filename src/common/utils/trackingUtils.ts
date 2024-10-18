// Internal Dependencies
import Mapbox from '@rnmapbox/maps';
import BackgroundLocation from '../backgrounGeolocation/BackgroundLocation';

export const getNextTrackingMode = (trackingMode: Mapbox.UserTrackingMode) => {
  const trackingModes = [
    Mapbox.UserTrackingMode.Follow,
    Mapbox.UserTrackingMode.FollowWithHeading,
  ];

  const currentTrackingModeIndex = trackingModes.indexOf(trackingMode);
  if (currentTrackingModeIndex < trackingModes.length - 1) {
    return trackingModes[currentTrackingModeIndex + 1];
  }

  return trackingModes[0];
};

export const syncPendingObservations = async () => {
  const pendingObservations = await BackgroundLocation.getCount();
  if (pendingObservations > 0) {
    await BackgroundLocation.sync();
  }
};
