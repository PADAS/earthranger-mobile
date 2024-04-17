// External Dependencies
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../../common/types/types';

// Internal Dependencies
import { ReportTypesView } from '../ReportTypesView';

// Types + Interfaces
// eslint-disable-next-line max-len
type StackNavigationPropAlias = NativeStackNavigationProp<RootStackParamList, 'ReportTypesView'>;

// Test Specific Mocks
jest.mock('../../../../../common/data/reports/useRetrieveReportTypesByCategory', () => ({
  useRetrieveReportTypesByCategory: () => ({
    retrieveReportTypesByCategory: () => Promise.resolve([
      {
        id: 1,
        display: 'Fence Report',
        priority: '100',
        icon_svg: '',
      },
      {
        id: 2,
        display: 'Crossing Report',
        priority: '200',
        icon_svg: '',
      },
      {
        id: 3,
        display: 'Confiscation',
        priority: '300',
        icon_svg: '',
      },
    ]),
  }),
}));

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: () => ({
    position: {
      coords: {
        latitude: 123.456,
        longitude: 456.123,
      },
    },
  }),
}));

jest.mock('recyclerlistview', () => ({
  ...jest.requireActual('recyclerlistview'),
  RecyclerListView: ({ dataProvider, layoutProvider, rowRenderer }) => {
    const data = dataProvider.getAllData();
    return data.map((datum, index) => rowRenderer(
      layoutProvider.getLayoutTypeForIndex(index),
      datum,
    ));
  },
}));

describe('ReportTypesView', () => {
  let navigation: Pick<StackNavigationPropAlias, 'setOptions' >;
  const route = {
    params: {
      category: '1',
      coordinates: [0, 0],
    },
  };

  beforeEach(() => {
    navigation = {
      setOptions: jest.fn(),
    };
  });

  it('matches snapshot', async () => {
    const { toJSON, getByText } = render(
      // @ts-ignore
      <ReportTypesView navigation={navigation} route={route} />,
    );

    await waitFor(() => {
      expect(getByText('Fence Report')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
