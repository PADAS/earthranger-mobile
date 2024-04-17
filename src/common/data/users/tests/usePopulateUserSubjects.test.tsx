import { filterUserSubjects } from '../usePopulateUserSubjects';
import { USER_MOCK_DATA } from '../../../mockData/userMockData';

describe('filterUserSubjects', () => {
  it('filter out subjects with names matching the current user', () => {
    const remoteUserSubjects = [
      ['1', '1', 'leoo'],
      ['1', '1', 'leoo Orihuela'],
      ['1', '1', 'leo-o'],
    ];

    // Call the filter function with mock data
    const filteredSubjects = filterUserSubjects(remoteUserSubjects, USER_MOCK_DATA);

    // Verify that "leo-o" is filtered out
    expect(filteredSubjects).toEqual([['1', '1', 'leo-o']]);
  });
});
