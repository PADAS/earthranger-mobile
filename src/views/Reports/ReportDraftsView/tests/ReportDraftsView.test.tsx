// External Dependencies
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Internal Dependencies
import { ReportDraftsView } from '../ReportDraftsView';
import { RootStackParamList } from '../../../../common/types/types';

// Types + Interfaces
// eslint-disable-next-line max-len
type StackNavigationPropAlias = NativeStackNavigationProp<RootStackParamList, 'ReportTypesView'>;

// Test Specific Mocks
jest.mock('../../../../common/data/reports/useRetrieveReportPendingSync', () => ({
  useRetrieveReportPendingSync: () => ({
    retrieveDraftReports: () => Promise.resolve([{
      id: '1',
      title: 'Reptile',
      updated_at: '1667529163154',
      icon_svg: '',
      default_priority: 0,
    }]),
  }),
}));

describe('ReportDraftsView', () => {
  let navigation: Pick<StackNavigationPropAlias, 'setOptions' >;

  beforeEach(() => {
    navigation = {
      setOptions: jest.fn(),
    };
  });

  it('matches snapshot', async () => {
    const { toJSON, getByText } = render(
      // @ts-ignore
      <ReportDraftsView navigation={navigation} />,
    );

    await waitFor(() => {
      expect(getByText('Reptile')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
