// Internal Dependencies
import {
  SUBJECT_GROUPS_MOCK_DATA,
} from '../../common/mockData/subjectsMockData';
import { USER_SESSION_MOCK_DATA } from '../../common/mockData/UserMockData';
import { getSubjectGroups } from '../subjectsAPI';

const axios = require('axios');

jest.mock('axios');

describe('SubjectsAPI', () => {
  beforeEach(() => {
    axios.create.mockReturnThis();
    axios.get.mockReset();
  });

  it('returns the subject groups without profileId', async () => {
    axios.get.mockResolvedValue(SUBJECT_GROUPS_MOCK_DATA);
    let profileId;
    const value = await getSubjectGroups(USER_SESSION_MOCK_DATA.access_token, profileId);
    expect(value).toEqual(SUBJECT_GROUPS_MOCK_DATA.data);
  });

  it('returns the subject groups with profileId', async () => {
    axios.get.mockResolvedValue(SUBJECT_GROUPS_MOCK_DATA);
    const profileId = '1234asdf';
    const value = await getSubjectGroups(USER_SESSION_MOCK_DATA.access_token, profileId);
    expect(value).toEqual(SUBJECT_GROUPS_MOCK_DATA.data);
  });
});
