// External Dependencies
import React from 'react';
import Mapbox, { SymbolLayerStyle } from '@rnmapbox/maps';
import { Feature } from 'geojson';

// Internal Dependencies
import { Track } from '../../../models/Observation';
import { icons } from '../../../../ui/AssetsUtils';

// Constants
export const TRACK_ICON_STYLES: SymbolLayerStyle = {
  iconSize: ['step', ['zoom'], 0, 11, 0.4 / 2, 15, 0.7 / 2],
  iconPitchAlignment: 'map',
  iconRotationAlignment: 'map',
  iconRotate: ['get', 'bearing'],
  iconImage: icons.TrackMapLocation.arrow,
  iconAllowOverlap: ['step', ['zoom'], false, 16, true],
};

// Interfaces
interface UserTrailPointsMapLayerProps {
  track: Track[];
}

// Utility Functions
const getFeature = (location: Track) => ({
  type: 'Feature' as Feature['type'],
  properties: {
    bearing: location.heading,
  },
  geometry: {
    type: 'Point',
    coordinates: location.position,
  },
});

export const UserTrailPointsMapLayer = ({ track }: UserTrailPointsMapLayerProps) => (
  <Mapbox.ShapeSource
    id="points"
    lineMetrics
    shape={{
      type: 'FeatureCollection',
      // @ts-ignore
      features: track.map((location) => getFeature(location)),
    }}
  >
    <Mapbox.SymbolLayer
      id="pointsLayer"
      layerIndex={111}
      // @ts-ignore
      style={TRACK_ICON_STYLES}
    />
  </Mapbox.ShapeSource>
);
