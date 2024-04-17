// External Dependencies
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AxiosError } from 'axios';

// Internal Dependencies
import { LoginForm } from '../LoginForm';
import { LOGIN_DATA } from '../../../../../common/mockData';

describe('LoginForm', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(
      <LoginForm
        internetErrorMessage=""
        userAccountErrorMessage=""
        trackAnalyticsEvent={() => {}}
        login={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot - shows password when clicking on eye icon', async () => {
    const { toJSON, getByTestId } = render(
      <LoginForm
        internetErrorMessage=""
        userAccountErrorMessage=""
        trackAnalyticsEvent={() => {}}
        login={() => {}}
        onSubmit={() => {}}
      />,
    );

    await waitFor(() => {
      const password = getByTestId('LoginView-Password');
      fireEvent.changeText(password, 'letmein');

      const showPasswordButton = getByTestId('LoginView-Password-Button');
      fireEvent.press(showPasswordButton);

      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('displays Internet Error Message', async () => {
    const { queryByText } = render(
      <LoginForm
        internetErrorMessage="Internet connection is needed to log in."
        userAccountErrorMessage=""
        trackAnalyticsEvent={() => {}}
        login={() => {}}
        onSubmit={() => {}}
      />,
    );

    await waitFor(() => expect(queryByText('Internet connection is needed to log in.')).toBeTruthy());
  });

  it('disables Log In Button - Validation', async () => {
    const { getByTestId } = render(
      <LoginForm
        internetErrorMessage=""
        userAccountErrorMessage=""
        trackAnalyticsEvent={() => {}}
        login={() => {}}
        onSubmit={() => {}}
      />,
    );

    await waitFor(() => {
      const logInButton = getByTestId('LoginView-LoginButton');
      expect(logInButton.props.accessibilityState.disabled).toBeTruthy();
    });
  });

  it('handles login error - network error', async () => {
    const error = {
      message: 'Network Error',
    };

    const { getByText } = render(
      <LoginForm
        internetErrorMessage=""
        userAccountErrorMessage=""
        loginError={error as AxiosError}
        trackAnalyticsEvent={() => {}}
        login={() => {}}
        onSubmit={() => {}}
      />,
    );

    await waitFor(() => {
      expect(getByText('Invalid site name')).toBeTruthy();
    });
  });

  it('handles login error - 400 response status', async () => {
    const error = {
      response: {
        status: 400,
      },
    };

    const { getByText } = render(
      <LoginForm
        internetErrorMessage=""
        userAccountErrorMessage=""
        loginError={error as AxiosError}
        trackAnalyticsEvent={() => {}}
        login={() => {}}
        onSubmit={() => {}}
      />,
    );

    await waitFor(() => {
      expect(getByText('Invalid username or password. Please try again.')).toBeTruthy();
    });
  });

  it('handles login success', async () => {
    const promise = jest.fn();

    const { getByTestId } = render(
      <LoginForm
        internetErrorMessage=""
        userAccountErrorMessage=""
        trackAnalyticsEvent={() => {}}
        login={promise}
        onSubmit={() => {}}
      />,
    );

    const siteName = getByTestId('LoginView-SiteName');
    const userName = getByTestId('LoginView-Username');
    const password = getByTestId('LoginView-Password');
    const rememberMe = getByTestId('LoginView-RememberMe');
    const submitButton = getByTestId('LoginView-LoginButton');

    await waitFor(() => {
      fireEvent.changeText(siteName, LOGIN_DATA.siteName);
      fireEvent.changeText(userName, LOGIN_DATA.userName);
      fireEvent.changeText(password, LOGIN_DATA.password);
      fireEvent(rememberMe, 'onValueChange', { nativeEvent: {} });

      fireEvent.press(submitButton);

      expect(promise).toHaveBeenCalled();
    });
  });

  it('handles onSubmitEditing in the form', async () => {
    const promise = jest.fn();

    const { getByTestId } = render(
      <LoginForm
        internetErrorMessage=""
        userAccountErrorMessage=""
        trackAnalyticsEvent={() => {}}
        login={promise}
        onSubmit={() => {}}
      />,
    );

    const siteName = getByTestId('LoginView-SiteName');
    const userName = getByTestId('LoginView-Username');
    const password = getByTestId('LoginView-Password');

    await waitFor(() => {
      fireEvent.changeText(siteName, LOGIN_DATA.siteName);
      fireEvent(siteName, 'submitEditing');
      fireEvent.changeText(userName, LOGIN_DATA.userName);
      fireEvent(userName, 'submitEditing');
      fireEvent.changeText(password, LOGIN_DATA.password);
      fireEvent(password, 'submitEditing');

      expect(promise).toHaveBeenCalled();
    });
  });
});
