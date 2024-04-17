// @ts-ignore
// External Dependencies
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContext } from '@react-navigation/native';

// Internal Dependencies
import { EventsList } from '../EventsList';
import { RootStackParamList } from '../../../../../common/types/types';
import { EventStatus } from '../../../../../common/enums/enums';
import { EVENTS_LIST_MOCK_DATA } from '../../../../../common/mockData/reportsMockData';

// Types + Interfaces
// eslint-disable-next-line max-len
type StackNavigationPropAlias = NativeStackNavigationProp<RootStackParamList, 'ReportsView'>;

// Needed when a view has a useFocusEffect
const navContext = {
  isFocused: () => true,
  // addListener returns an unscubscribe function.
  addListener: jest.fn(() => jest.fn()),
};

describe('EventsList', () => {
  let navigation: Pick<StackNavigationPropAlias, 'navigate' >;

  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
      // @ts-ignore
      setOptions: jest.fn(),
      setParams: jest.fn(),
    };
  });

  it('matches snapshot', async () => {
    const { toJSON, getByText } = render(
      // @ts-ignore
      <NavigationContext.Provider value={navContext}>
        {/* @ts-ignore */}
        <EventsList navigation={navigation} events={EVENTS_LIST_MOCK_DATA} />
      </NavigationContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText('All Posts')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('Verify number of rendered items in FlashList', async () => {
    const { getByTestId } = render(
      // @ts-ignore
      <NavigationContext.Provider value={navContext}>
        {/* @ts-ignore */}
        <EventsList navigation={navigation} events={EVENTS_LIST_MOCK_DATA} />
      </NavigationContext.Provider>,
    );

    await waitFor(() => {
      const element = getByTestId('EventsList-FlashList');
      expect(element.props.data).toHaveLength(EVENTS_LIST_MOCK_DATA.length);
    });
  });

  it('Verify number of rendered drafts in FlashList', async () => {
    const { getByTestId } = render(
      // @ts-ignore
      <NavigationContext.Provider value={navContext}>
        {/* @ts-ignore */}
        <EventsList navigation={navigation} events={EVENTS_LIST_MOCK_DATA} />
      </NavigationContext.Provider>,
    );

    await waitFor(() => {
      const element = getByTestId('EventsList-FlashList');
      expect(element.props.data.filter(
        (event: any) => event.status === EventStatus.draft,
      )).toHaveLength(EVENTS_LIST_MOCK_DATA.filter(
        (event: any) => event.status === EventStatus.draft,
      ).length);
    });
  });
});
