// @ts-ignore
// External Dependencies
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContext } from '@react-navigation/native';

// Internal Dependencies
import { PatrolsTypeView } from '../PatrolsTypeView';

// Needed when a view has a useFocusEffect
const navContext = {
  isFocused: () => true,
  // addListener returns an unscubscribe function.
  addListener: jest.fn(() => jest.fn()),
};

// Test Specific Mocks
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      setOptions: jest.fn(),
      getState: () => ({
        index: 0,
        routes: [
          {
            params: {
              coordinates: [0, 0],
            },
          },
        ],
      }),
    }),
    useRoute: () => ({
      params: {
        id: '',
      },
    }),
  };
});

jest.mock('../../../../../common/data/patrols/useRetrievePatrolTypes', () => ({
  useRetrievePatrolTypes: () => ({
    retrievePatrolTypes: () => Promise.resolve([
      {
        id: 1,
        remote_id: '634eb8e5-94e9-4b23-823a-e612e1aaaa01',
        account_id: 1,
        value: 'Travel',
        display: 'Boat Patrol',
        icon: 'boat-patrol-icon',
        icon_svg: '',
        default_priority: 0,
        is_active: 1,
        is_selected: false,
      },
      {
        id: 2,
        remote_id: '634eb8e5-94e9-4b23-823a-e612e1aaaa02',
        account_id: 1,
        value: 'bicycle-patrol',
        display: 'Routine Patrol',
        icon: 'routine-patrol-icon',
        icon_svg: '',
        default_priority: 0,
        is_active: 1,
        is_selected: false,
      },
      {
        id: 3,
        remote_id: '634eb8e5-94e9-4b23-823a-e612e1aaaa03',
        account_id: 1,
        value: 'fence_patrol',
        display: 'Fence Patrol',
        icon: 'vehicle-patrol-icon',
        icon_svg: '',
        default_priority: 0,
        is_active: 1,
        is_selected: false,
      },
    ]),
  }),
}));

describe('PatrolsTypeView', () => {
  it('matches snapshot', async () => {
    const { toJSON, getByText } = render(
      // @ts-ignore
      <NavigationContext.Provider value={navContext}>
        {/* @ts-ignore */}
        <PatrolsTypeView />
      </NavigationContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText('Boat Patrol')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
