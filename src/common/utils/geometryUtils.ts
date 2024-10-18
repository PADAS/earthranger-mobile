// External Dependencies
import Config from 'react-native-config';
import { point as TurfPoint, polygon, Position } from '@turf/helpers';
import area from '@turf/area';
import length from '@turf/length';
import { polygonToLine } from '@turf/polygon-to-line';
import bbox from '@turf/bbox';
import { clone } from 'lodash-es';
import { Dimensions } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import distance from '@turf/distance';

// Internal Dependencies
import {
  BASEMAP_KEY,
  COORDINATES_SCALE,
  MAPBOX_MAXIMUM_LATITUDE,
} from '../constants/constants';
import { getMapBoxStaticImageUrl, MAPBOX_STYLE_STREETS } from '../../api/EarthRangerService';
import { Size } from '../types/types';
import { getStringForKey } from '../data/storage/keyValue';

const defaultStaticImageSize = {
  width: Dimensions.get('window').width.toFixed(0),
  height: 124,
} as unknown as Size;

export const calculatePolygonArea = (coords: Position[][]) => area(polygon(coords));

export const calculatePolygonPerimeter = (coordinates: any) => parseFloat(
  length(
    polygonToLine(
      createPolygon(
        coordinates,
      ),
    ),
    { units: 'meters' },
  ).toFixed(2),
);

export const createPolygon = (coords: Position[][]) => polygon(coords);

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
  const baseMap = getBaseMapId(getStringForKey(BASEMAP_KEY) || MapboxGL.StyleURL.Street);

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

const getBaseMapId = (baseMap: string) => baseMap.split('/').pop() || MAPBOX_STYLE_STREETS;
export const createMapBoxPolygonMapURL = (geometry: any, size: Size = defaultStaticImageSize) => {
  // Get polygon geometry
  const eventPolygon = geometry.features.find((feature: any) => feature.geometry.type === 'Polygon');

  // Polygon coordinates
  const coordinates: Position[][] = clone(eventPolygon.geometry.coordinates);
  const resultCoordinates: Position[] = [];

  // Format polygon coordinates to 6 decimals, it reduces around 1/3 of the data
  const coordinatesList = coordinates.pop();

  if (coordinatesList) {
    for (let i = 0, l = coordinatesList.length; i < l; i++) {
      resultCoordinates.push(
        [
          parseFloat(coordinatesList[i][0].toFixed(6)),
          parseFloat(coordinatesList[i][1].toFixed(6)),
        ],
      );
    }
  }

  // Deep copy to avoid messing the original geometry
  const simplifiedGeoJSON = JSON.parse(JSON.stringify(geometry));
  simplifiedGeoJSON.features[0].geometry.coordinates = [resultCoordinates];
  simplifiedGeoJSON.features[0].properties = {
    ...simplifiedGeoJSON.features[0].properties,
    fill: '#FF9500',
    'fill-opacity': 0.5,
    stroke: '#FF9500',
  };

  // Calculate Bounding Box
  const eventGeometryBbox = bbox(eventPolygon);

  // Calculate min and max coordinates
  const minLon = eventGeometryBbox[0];
  const minLat = Math.max(-MAPBOX_MAXIMUM_LATITUDE, eventGeometryBbox[1]);
  const maxLon = eventGeometryBbox[2];
  const maxLat = Math.min(MAPBOX_MAXIMUM_LATITUDE, eventGeometryBbox[3]);

  // Encode polygon geometry to send it to MapBox Static Image API
  const eventGeoJSONEncoded = `geojson(${encodeURIComponent(JSON.stringify(simplifiedGeoJSON))})`;

  // Format min and max coordinates
  const areaForGeometryBBOX = `[${minLon},${minLat},${maxLon},${maxLat}]`;

  // Define static image dimensions
  const staticImageDimensions = `${size.width}x${size.height}`;

  // Append Access Token to request
  const mapboxStaticImageAPIQuery = `padding=30&access_token=${Config.MAPBOX_API_KEY}`;

  const baseMap = getBaseMapId(getStringForKey(BASEMAP_KEY) || MapboxGL.StyleURL.Street);

  return `${getMapBoxStaticImageUrl(baseMap)}/${eventGeoJSONEncoded}/${areaForGeometryBBOX}/${staticImageDimensions}?${mapboxStaticImageAPIQuery}`;
};

export const getReportAreaValues = (areaInMeters: number, perimeterInMeters: number) => {
  let areaValue = '';
  let perimeterValue = '';

  if (areaInMeters > 1000) {
    areaValue = `${(areaInMeters / 1000).toFixed(2)} sqkm`;
  } else {
    areaValue = `${areaInMeters} sqm`;
  }

  if (perimeterInMeters > 1000) {
    perimeterValue = `${(perimeterInMeters / 1000).toFixed(2)} km`;
  } else {
    perimeterValue = `${perimeterInMeters} m`;
  }

  return [areaValue, perimeterValue];
};

export const addDistance = (from: Position, to: Position, currentDistance: number) => {
  const start = TurfPoint(from);
  const end = TurfPoint(to);

  return currentDistance + distance(start, end);
};
