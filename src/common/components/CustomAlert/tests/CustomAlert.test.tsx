// External Dependencies
import React from 'react';
import { render } from '@testing-library/react-native';

// Internal Dependencies
import { CustomAlert } from '../CustomAlert';
import { ALERT_BUTTON_BACKGROUND_COLOR_BLUE } from '../../../constants/constants';
import { LocationSmallGray } from '../../../icons/LocationSmallGray';

// Mocks
const CUSTOM_ALERT_MOCK = {
  title: 'Alert Title',
  message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam semper in dolor et egestas.',
  positiveButton: 'Accept',
  negativeButton: 'Reject',
  icon: <LocationSmallGray />,
};

describe('CustomAlert', () => {
  it('matches snapshot', () => {
    const { toJSON } = render(
      <CustomAlert
        displayAlert
        alertTitleText={CUSTOM_ALERT_MOCK.title}
        alertMessageText={CUSTOM_ALERT_MOCK.message}
        positiveButtonText={CUSTOM_ALERT_MOCK.positiveButton}
        negativeButtonText={CUSTOM_ALERT_MOCK.negativeButton}
        onPositiveButtonPress={() => {}}
        onNegativeButtonPress={() => {}}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot - with alert icon', () => {
    const { toJSON } = render(
      <CustomAlert
        displayAlert
        alertIcon={CUSTOM_ALERT_MOCK.icon}
        alertTitleText={CUSTOM_ALERT_MOCK.title}
        alertMessageText={CUSTOM_ALERT_MOCK.message}
        positiveButtonText={CUSTOM_ALERT_MOCK.positiveButton}
        negativeButtonText={CUSTOM_ALERT_MOCK.negativeButton}
        onPositiveButtonPress={() => {}}
        onNegativeButtonPress={() => {}}
        positiveButtonBackgroundColor={ALERT_BUTTON_BACKGROUND_COLOR_BLUE}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot - with progress bar', () => {
    const { toJSON } = render(
      <CustomAlert
        displayAlert
        alertTitleText={CUSTOM_ALERT_MOCK.title}
        progress={1}
        alertMessageText={CUSTOM_ALERT_MOCK.message}
        negativeButtonText={CUSTOM_ALERT_MOCK.negativeButton}
        onNegativeButtonPress={() => {}}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
