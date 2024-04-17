// External Dependencies
import React from 'react';
import { render } from '@testing-library/react-native';

// Internal Dependencies
import { Loader } from '../Loader';

describe('Loader', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(
      <Loader isVisible />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
