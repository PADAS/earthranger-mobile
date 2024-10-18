// Internal Dependencies
import {
  calculatePolygonArea,
  calculatePolygonPerimeter,
  convertAreaToSqKM,
  convertPerimeterToKM,
} from '../geometryUtils';

const POLYGON = [
  [
    [-103.3799293745991, 20.672206653992816],
    [-103.37888086177193, 20.67319449634296],
    [-103.38101794647328, 20.67481941572916],
    [-103.3833203778363, 20.673193967806057],
    [-103.38104265596722, 20.67119785435777],
    [-103.3799293745991, 20.672206653992816],
  ],
];

jest.mock('@react-native-mapbox-gl/maps', () => ({
  StyleURL: {
    Street: '',
  },
}));

describe('geometryUtils', () => {
  it('returns a polygon\'s area in meters', () => {
    const area = calculatePolygonArea(POLYGON);

    expect(area).toBe(93448.3502231519);
  });

  it('returns a polygon\'s perimeter in meters', () => {
    const perimeter = calculatePolygonPerimeter(POLYGON);

    expect(perimeter).toBe(1227.29);
  });

  it('returns a polygon\'s area in sqkm', () => {
    const area = calculatePolygonArea(POLYGON);
    const formattedArea = convertAreaToSqKM(area);

    expect(formattedArea).toBe('0.09');
  });

  it('returns a polygon\'s perimeter in km', () => {
    const perimeter = calculatePolygonPerimeter(POLYGON);
    const formattedPerimeter = convertPerimeterToKM(perimeter);

    expect(formattedPerimeter).toBe('1.23');
  });
});
