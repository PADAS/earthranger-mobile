// External Dependencies
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ReduxThunk from 'redux-thunk';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Internal Dependencies
import LoginView from '../LoginView';
import { STORE_INITIAL_STATE } from '../../../common/mockData';
import { RootStackParamList } from '../../../common/types/types';

// Types + Interfaces
// eslint-disable-next-line max-len
type StackNavigationPropAlias = NativeStackNavigationProp<RootStackParamList, 'ReportTypesView'>;

describe('LoginView', () => {
  let store: any;
  let navigation: Pick<StackNavigationPropAlias, 'navigate', 'addListener'>;
  const route = {
    params: {
      shouldShowTokenExpiredAlert: false,
    },
  };

  beforeEach(() => {
    const middlewares = [ReduxThunk];
    const mockStore = configureMockStore(middlewares);
    store = mockStore(STORE_INITIAL_STATE);
    navigation = {
      navigate: jest.fn(),
      addListener: jest.fn(),
    };
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <LoginView navigation={navigation} route={route} />
      </Provider>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
