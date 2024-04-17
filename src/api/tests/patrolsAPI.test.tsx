// External Dependencies
import fetchMock from 'jest-fetch-mock';

// Internal Dependencies
import {
  PATROL_TRACKED_BY_RESPONSE_MOCK_DATA,
  PATROL_TYPES_RESPONSE_MOCK_DATA,
} from '../../common/mockData/patrolsMockData';
import { USER_SESSION_MOCK_DATA } from '../../common/mockData/UserMockData';
import { getPatrolTrackedBy, getPatrolTypes, parsePatrolTypes } from '../patrolsAPI';

const axios = require('axios');

jest.mock('axios');
jest.mock('react-native-mmkv');

describe('PatrolsAPI', () => {
  beforeAll(() => {
    axios.create.mockReturnThis();
  });

  it('returns the patrol types', async () => {
    axios.get.mockResolvedValue(PATROL_TYPES_RESPONSE_MOCK_DATA);

    const value = await getPatrolTypes(USER_SESSION_MOCK_DATA.access_token);
    expect(value).toEqual(PATROL_TYPES_RESPONSE_MOCK_DATA.data);
  });

  it('parses patrol types', async () => {
    fetchMock.mockResponseOnce('<svg></svg>');

    const parsedPatrolTypes = await parsePatrolTypes(PATROL_TYPES_RESPONSE_MOCK_DATA.data, '1');

    expect(parsedPatrolTypes).toStrictEqual([[
      'd0884b8c-4ecb-45da-841d-f2f8d6246abf',
      '1',
      'heli-p-new',
      'Helicopter Patrol',
      'helicopter-patrol-icon',
      '',
      '200',
      '1',
      '1',
    ]]);
  });

  it('returns patrol tracked by', async () => {
    axios.get.mockResolvedValue(PATROL_TRACKED_BY_RESPONSE_MOCK_DATA);

    const value = await getPatrolTrackedBy(USER_SESSION_MOCK_DATA.access_token);
    expect(value).toEqual(PATROL_TRACKED_BY_RESPONSE_MOCK_DATA.data);
  });
});
