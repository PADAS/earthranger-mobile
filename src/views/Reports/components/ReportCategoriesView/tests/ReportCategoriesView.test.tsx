// External Dependencies
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Internal Dependencies
import { ReportCategoriesView } from '../ReportCategoriesView';
import { RootStackParamList } from '../../../../../common/types/types';

// Types + Interfaces
// eslint-disable-next-line max-len
type StackNavigationPropAlias = NativeStackNavigationProp<RootStackParamList, 'ReportCategoriesView'>;

// Test Specific Mocks
jest.mock('../../../../../common/data/reports/useRetrieveReportCategories', () => ({
  useRetrieveReportCategories: () => ({
    retrieveReportCategoriesByUserType: () => Promise.resolve([{
      id: 1,
      display: 'Test',
    }]),
  }),
}));

describe('ReportCategoriesView', () => {
  let navigation: Pick<StackNavigationPropAlias, 'navigate'>;
  const route = {
    params: {
      coordinates: [1, 2],
    },
  };

  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
    };
  });

  it('matches snapshot', async () => {
    const { toJSON, getByText } = render(
      // @ts-ignore
      <ReportCategoriesView navigation={navigation} route={route} />,
    );

    await waitFor(() => {
      expect(getByText('Test')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
