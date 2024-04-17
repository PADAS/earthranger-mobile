// Internal Dependencies
import {
  CATEGORIES_RESPONSE_MOCK_DATA,
  FILE_MOCK_DATA, NOTE_MOCK_DATA,
  PATROL_SEGMENT_EVENT_MOCK_DATA,
  POST_NOTE_RESPONSE_MOCK_DATA,
  POST_PATROL_SEGMENT_EVENT_RESPONSE_DATA,
  REPORT_MOCK_DATA,
  REPORT_TYPES_RESPONSE_MOCK_DATA,
  UPLOAD_FILE_RESPONSE_MOCK_DATA,
} from '../../common/mockData/reportsMockData';
import { USER_SESSION_MOCK_DATA } from '../../common/mockData/UserMockData';
import {
  createReportNote,
  getReportCategories,
  getReportTypes,
  parseReportCategories,
  postPatrolSegmentEvent,
} from '../reportsAPI';
import { uploadAttachmentFile } from '../attachmentAPI';

const axios = require('axios');

jest.mock('axios');
jest.mock('react-native-mmkv');

describe('ReportsAPI', () => {
  beforeAll(() => {
    axios.create.mockReturnThis();
  });

  it('returns the category value', async () => {
    axios.get.mockResolvedValue(CATEGORIES_RESPONSE_MOCK_DATA);

    const value = await getReportCategories(USER_SESSION_MOCK_DATA.access_token);
    expect(value).toEqual(CATEGORIES_RESPONSE_MOCK_DATA.data);
  });

  it('returns the report types', async () => {
    axios.get.mockResolvedValue(REPORT_TYPES_RESPONSE_MOCK_DATA);

    const value = await getReportTypes(USER_SESSION_MOCK_DATA.access_token);
    expect(value).toEqual(REPORT_TYPES_RESPONSE_MOCK_DATA.data);
  });

  it('parses report categories', () => {
    const parsedReportCategories = parseReportCategories(CATEGORIES_RESPONSE_MOCK_DATA.data, '1');

    expect(parsedReportCategories).toStrictEqual([[
      '3c7f5dc3-dc33-4e7e-9de4-33b97b5fab03',
      '1',
      '[]',
      'sprinttesting',
      'Sprint Testing',
      '-4',
    ]]);
  });

  it('upload report attachment', async () => {
    const entries = jest.fn();
    const append = jest.fn();
    global.FormData = () => ({ entries, append });
    axios.post.mockResolvedValue(UPLOAD_FILE_RESPONSE_MOCK_DATA);

    const value = await uploadAttachmentFile(
      USER_SESSION_MOCK_DATA.access_token,
      REPORT_MOCK_DATA.reportId,
      FILE_MOCK_DATA,
    );
    expect(value).toEqual(UPLOAD_FILE_RESPONSE_MOCK_DATA.data);
  });

  it('post report note', async () => {
    axios.post.mockResolvedValue(POST_NOTE_RESPONSE_MOCK_DATA);

    const value = await createReportNote(
      USER_SESSION_MOCK_DATA.access_token,
      REPORT_MOCK_DATA.reportId,
      NOTE_MOCK_DATA,
    );
    expect(value).toEqual(POST_NOTE_RESPONSE_MOCK_DATA.data);
  });

  it('post patrol segment event', async () => {
    axios.post.mockResolvedValue(POST_PATROL_SEGMENT_EVENT_RESPONSE_DATA);

    const value = await postPatrolSegmentEvent(
      USER_SESSION_MOCK_DATA.access_token,
      '2160cd72-9a6e-4129-9c06-9e87e91e47e5',
      PATROL_SEGMENT_EVENT_MOCK_DATA,
    );

    expect(value).toEqual(POST_PATROL_SEGMENT_EVENT_RESPONSE_DATA.data);
  });
});
