// External Dependencies
import React from 'react';
import Mapbox from '@rnmapbox/maps';

// Internal Dependencies
import { Track } from '../../../models/Observation';
import { COLORS_LIGHT } from '../../../../common/constants/colors';

// Interfaces
interface UserTrailsMapLayerProps {
  track: Track[];
}

export const UserTrailsMapLayer = ({ track }: UserTrailsMapLayerProps) => (
  <Mapbox.ShapeSource
    id="line"
    lineMetrics
    shape={{
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: track.map((location) => location.position),
      },
      properties: {},
    }}
  >
    <Mapbox.LineLayer
      id="lineLayer"
      layerIndex={110}
      style={{
        lineColor: COLORS_LIGHT.amber,
        lineCap: 'round',
        lineJoin: 'miter',
        lineWidth: 4,
      }}
    />
  </Mapbox.ShapeSource>
);
