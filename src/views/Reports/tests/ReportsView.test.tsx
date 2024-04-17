// External Dependencies
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as MMKV from 'react-native-mmkv';

// Internal Dependencies
import { ReportsView } from '../ReportsView';
import { RootStackParamList } from '../../../common/types/types';

// Types + Interfaces
// eslint-disable-next-line max-len
type StackNavigationPropAlias = NativeStackNavigationProp<RootStackParamList, 'ReportsView'>;

jest.mock('geodesy/latlon-ellipsoidal-vincenty', () => ({
  LatLon: jest.fn(),
}));

jest.mock('geodesy/utm', () => ({
  LatLon: jest.fn(),
}));

jest.mock('geodesy/mgrs', () => ({
  LatLon: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('ReportsView', () => {
  let navigation: Pick<StackNavigationPropAlias, 'navigate'>;

  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
      // @ts-ignore
      addListener: jest.fn().mockImplementation((event, callback) => {
        callback();
        return {
          remove: jest.fn(),
        };
      }),
    };
  });

  it('matches snapshot', () => {
    jest.spyOn(MMKV, 'useMMKVBoolean').mockImplementation(() => ([false, jest.fn()]));
    jest.spyOn(MMKV, 'useMMKVNumber').mockImplementation(() => ([1, jest.fn()]));
    const { toJSON } = render(
      <ReportsView navigation={navigation} reportDraftsCount={0} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('shows submitted info customAlert', async () => {
    jest.spyOn(MMKV, 'useMMKVBoolean').mockImplementation(() => ([false, jest.fn()]));
    jest.spyOn(MMKV, 'useMMKVNumber').mockImplementation(() => ([1, jest.fn()]));

    const { getByTestId, getByText } = render(
      <ReportsView navigation={navigation} reportsDraftCount={0} />,
    );
    await waitFor(() => {
      const showSubmittedInfoIcon = getByTestId('ReportsView-InfoIcon');
      fireEvent.press(showSubmittedInfoIcon);
    });

    expect(getByText('When the device has a good connection the app will sync submited reports and update changes to the report forms. The number of submitted reports will reset each time you switch active users.')).toBeTruthy();
  });
});
