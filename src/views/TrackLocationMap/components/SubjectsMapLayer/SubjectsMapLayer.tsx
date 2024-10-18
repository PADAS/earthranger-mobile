// External Dependencies
import React from 'react';
import {
  CircleLayer, Image, Images, ShapeSource, SymbolLayer, SymbolLayerStyle,
} from '@rnmapbox/maps';
import { FeatureCollection, Geometry } from '@turf/helpers';
import { GeoJsonProperties } from 'geojson';

// Internal Dependencies
import { SubjectIcon } from '../../../../common/icons/SubjectIcon';

// Interfaces
interface SubjectsMapLayerProps {
  subjectsGeoJson: FeatureCollection<Geometry, GeoJsonProperties> | null;
  onPress: (event: any) => void
}

// Map Layer styles
const layerStyles: {
  subjectIconLabel: SymbolLayerStyle;
} = {
  subjectIconLabel: {
    iconImage: 'subject-icon',
    iconSize: 0.8,
    iconAllowOverlap: true,
    textField: ['format', ['get', 'title'], { 'font-scale': 0.9, 'font-weight': 'bold' }],
    textSize: 12,
    textColor: 'black',
    textHaloColor: 'white',
    textHaloWidth: 2,
    textAnchor: 'left',
    textOffset: [1.3, 0],
    textJustify: 'left',
  },
};

export const SubjectsMapLayer = ({ subjectsGeoJson, onPress }: SubjectsMapLayerProps) => (
  <ShapeSource
    id="subjects"
    cluster
    clusterMaxZoomLevel={17}
    clusterRadius={30}
    shape={subjectsGeoJson}
    onPress={(event) => { onPress(event); }}
  >
    <SymbolLayer
      id="pointCount"
      style={{
        textField: ['get', 'point_count'],
        textSize: 12,
        textColor: '#000000',
        textAnchor: 'center',
        textJustify: 'center',
      }}
    />
    <CircleLayer
      id="clusteredPoints"
      belowLayerID="pointCount"
      filter={['has', 'point_count']}
      style={{
        circleColor: '#FFFFFF',
        circleRadius: [
          'step',
          ['get', 'point_count'],
          20,
          25,
          30,
          100,
          40,
        ],
        circleOpacity: 0.84,
        circleStrokeWidth: 2,
        circleStrokeColor: '#3E35A3',
      }}
    />
    <SymbolLayer
      id="singlePoint"
      filter={['!', ['has', 'point_count']]}
      style={layerStyles.subjectIconLabel}
    />
    <Images>
      <Image name="subject-icon">
        <SubjectIcon />
      </Image>
    </Images>
  </ShapeSource>
);
