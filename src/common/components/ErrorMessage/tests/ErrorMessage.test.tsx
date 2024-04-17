// External Dependencies
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

// Internal Dependencies
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('matches snapshot', async () => {
    const { toJSON, getByText } = render(
      <ErrorMessage onIconClickHandler={jest.fn()} />,
    );

    await waitFor(() => {
      expect(getByText('Unable to sync, try again later.')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });
});
