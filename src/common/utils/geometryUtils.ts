// External Dependencies
import Config from 'react-native-config';
import {
  Feature,
  FeatureCollection,
  Geometry,
  point as TurfPoint,
  polygon,
  Position,
} from '@turf/helpers';
import area from '@turf/area';
import length from '@turf/length';
import { polygonToLine } from '@turf/polygon-to-line';
import bbox from '@turf/bbox';
import { Dimensions } from 'react-native';
import distance from '@turf/distance';
import Mapbox from '@rnmapbox/maps';

// Internal Dependencies
import {
  BASEMAP_KEY,
  COORDINATES_SCALE,
  MAPBOX_MAXIMUM_LATITUDE,
} from '../constants/constants';
import { getMapBoxStaticImageUrl, MAPBOX_STYLE_STREETS } from '../../api/EarthRangerService';
import { Size } from '../types/types';
import { getStringForKey } from '../data/storage/keyValue';

// ------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------

const DEFAULT_FILL_COLOR = '#FF9500';
const DEFAULT_FILL_OPACITY = 0.5;
const DEFAULT_STROKE_COLOR = '#FF9500';

// ------------------------------------------------------------------------
// Internal Functions
// ------------------------------------------------------------------------

const addStylingToFeature = (feature: Feature<Geometry>): Feature<Geometry> => ({
  ...feature,
  properties: {
    ...feature.properties,
    fill: DEFAULT_FILL_COLOR,
    'fill-opacity': DEFAULT_FILL_OPACITY,
    stroke: DEFAULT_STROKE_COLOR,
  },
});

const calculateBoundingBox = (featureCollection: FeatureCollection): number[] => {
  const boundingBox = bbox(featureCollection);
  return [
    boundingBox[0],
    Math.max(-MAPBOX_MAXIMUM_LATITUDE, boundingBox[1]),
    boundingBox[2],
    Math.min(MAPBOX_MAXIMUM_LATITUDE, boundingBox[3]),
  ];
};

const defaultStaticImageSize = {
  width: Dimensions.get('window').width.toFixed(0),
  height: 124,
} as unknown as Size;

const encodeGeoJSON = (geojson: any): string => `geojson(${encodeURIComponent(JSON.stringify(geojson))})`;

// eslint-disable-next-line @typescript-eslint/no-shadow
const formatBoundingBox = (bbox: number[]): string => `[${bbox.join(',')}]`;

const getBaseMapId = (baseMap: string) => baseMap.split('/').pop() || MAPBOX_STYLE_STREETS;

const simplifyCoordinates = (coordinates: Position[][]): Position[] => coordinates[0].map((coord) => [
  parseFloat(coord[0].toFixed(6)),
  parseFloat(coord[1].toFixed(6)),
]);

// ------------------------------------------------------------------------
// Public Functions
// ------------------------------------------------------------------------

export const addDistance = (from: Position, to: Position, currentDistance: number) => {
  const start = TurfPoint(from);
  const end = TurfPoint(to);

  return currentDistance + distance(start, end);
};

export const calculatePolygonArea = (coords: Position[][]) => area(polygon(coords));

export const calculatePolygonPerimeter = (coordinates: Position[][]) => parseFloat(
  length(
    polygonToLine(
      polygon(
        coordinates,
      ),
    ),
    { units: 'meters' },
  ).toFixed(2),
);

export const convertCoordinateToPoint = (coordinate: Position) => {
  const [longitude, latitude] = coordinate;
  return {
    x: (longitude + 180) * (256 / 360),
    // eslint-disable-next-line max-len, no-mixed-operators
    y: (256 / 2) - (256 * Math.log(Math.tan((Math.PI / 4) + ((latitude * Math.PI / 180) / 2))) / (2 * Math.PI)),
  };
};

export const calculatePolygonPointsList = (coordinates: Position[]) => {
  // Calculate polygon path and view box
  let minX: number = 256;
  let minY: number = 256;
  let maxX: number = 0;
  let maxY: number = 0;
  const polygonPointsList: string[] = [];

  coordinates.forEach((coordinate) => {
    const point = convertCoordinateToPoint(coordinate);
    // Get the minimum values for X and Y
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
  });

  coordinates.forEach((coordinate) => {
    const point = convertCoordinateToPoint(coordinate);
    /**
     * Since the coordinates in the polygon are very close to each other
     * (the difference between points is in the scale of centesimals or less)
     * it's necessary to generate a polygon with points far from each other,
     * in order to get a more manageable polygon that can have a stroke and look
     * fine in the screen.
     */
    const scaledPointX = (point.x - minX) * COORDINATES_SCALE;
    const scaledPointY = (point.y - minY) * COORDINATES_SCALE;

    maxX = Math.max(maxX, scaledPointX);
    maxY = Math.max(maxY, scaledPointY);
    polygonPointsList.push(`${scaledPointX},${scaledPointY}`);
  });

  return {
    polygonPointsList,
    maxX,
    maxY,
  };
};

export const createMapBoxPointMapURL = (coordinates: Position) => {
  const baseMap = getBaseMapId(getStringForKey(BASEMAP_KEY) || Mapbox.StyleURL.Street);

  // Base url with basemap
  let url = getMapBoxStaticImageUrl(baseMap);
  // Coordinates
  url = url.concat(`/pin-s+0056C7(${coordinates})/${coordinates},11,0`);
  // Image size
  url = url.concat(`/${defaultStaticImageSize.width}x${defaultStaticImageSize.height}`);
  // MapBox API key
  url = url.concat(`?access_token=${Config.MAPBOX_API_KEY}`);

  return url;
};

export const createMapBoxPolygonMapURL = (
  geojson: FeatureCollection,
  size: Size = defaultStaticImageSize,
): string => {
  // Simplify coordinates and add styling for each feature
  const simplifiedFeatures = geojson.features.map((feature) => {
    if (feature.geometry.type === 'Polygon') {
      return addStylingToFeature({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: [simplifyCoordinates(feature.geometry.coordinates as Position[][])],
        },
      });
    }
    return feature;
  });

  const simplifiedGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: simplifiedFeatures,
  };

  // Calculate and format bounding box
  const boundingBox = calculateBoundingBox(geojson);
  const formattedBBox = formatBoundingBox(boundingBox);

  // Encode GeoJSON for URL
  const encodedGeoJSON = encodeGeoJSON(simplifiedGeoJSON);

  // Format image dimensions
  const imageDimensions = `${size.width}x${size.height}`;

  // Construct URL
  const baseUrl = `https://api.mapbox.com/styles/v1/${Mapbox.StyleURL.Street}/static`;
  const queryParams = `padding=30&access_token=${Config.MAPBOX_API_KEY}`;

  return `${baseUrl}/${encodedGeoJSON}/${formattedBBox}/${imageDimensions}?${queryParams}`;
};

export const convertAreaToSqKM = (areaInMeters: number) => {
  // There are 1,000,000 square meters in a square kilometer
  const METERS_IN_KM = 1000000;

  return (areaInMeters / METERS_IN_KM).toFixed(2);
};

export const convertPerimeterToKM = (perimeterInMeters: number) => {
  // There are 1,000 meters in a kilometer
  const METERS_IN_KM = 1000;

  return (perimeterInMeters / METERS_IN_KM).toFixed(2);
};

// eslint-disable-next-line consistent-return
export const getCoordinatesFromFeature = (inputFeature: string): Position | undefined => {
  const feature = JSON.parse(inputFeature);
  if (feature.geometry && feature.geometry.type === 'Point') {
    return feature.geometry.coordinates as Position;
  }
};
