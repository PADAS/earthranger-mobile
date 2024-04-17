import analytics from '@react-native-firebase/analytics';

export const logEvent = async (event: string, params?: { [key: string]: any }) => {
  analytics().logEvent(event, params);
};

export const logScreenView = async (screenViewParams: {}) => {
  analytics().logScreenView(screenViewParams);
};

export default logEvent;
