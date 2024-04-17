/* eslint-disable arrow-body-style */
// External Dependencies
import React from 'react';

// Internal Dependencies
import { TrackingOverlayButton } from './TrackingOverlayButton/TrackingOverlayButton';

// Interfaces
interface TrackingOverlayProps {
  isDeviceOnline: boolean;
  isTrackingEnabled: boolean;
  isPatrolEnabled: boolean;
}

export const TrackingOverlay = ({
  isDeviceOnline,
  isTrackingEnabled,
  isPatrolEnabled,
}: TrackingOverlayProps) => {
  return (
    <TrackingOverlayButton
      isTrackingEnabled={isTrackingEnabled}
      isPatrolEnabled={isPatrolEnabled}
      isDeviceOnline={isDeviceOnline}
    />
  );
};
