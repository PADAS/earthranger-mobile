// External Dependencies
import React from 'react';
import { render } from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Internal Dependencies
import { ReportNoteView } from '../ReportNoteView';

const mockStore = configureMockStore();
const store = mockStore({});

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

describe('ReportNoteView', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <ReportNoteView />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
