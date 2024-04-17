import 'react-native-gesture-handler';
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable-next-line import/extensions */
/**
 * @format
 */

import {
  AppRegistry,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import 'react-native-get-random-values';

import App from './App';
import { name as appName } from './app.json';
import { store } from './src/common/state/store';
import './i18n.config';
import log from './src/common/utils/logUtils';
import { getBoolForKey } from './src/common/data/storage/keyValue';
import { SYNC_TRACKS_MANUALLY, IS_IOS } from './src/common/constants/constants';
import { MAX_FONT_SIZE_MULTIPLIER } from './src/common/constants/fonts';
import BackgroundLocation from './src/common/backgrounGeolocation/BackgroundLocation';
import { loadReactNativeUILibraryConfiguration } from './RNUILib.config';

const headlessTask = async (event) => {
  switch (event.name) {
    case 'heartbeat':
      try {
        const location = await getCurrentPosition();
        log.debug('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);
      } catch (error) {
        log.error('[BackgroundGeolocation HeadlessTask] - getCurrentPosition: error', error);
      }
      if (getBoolForKey(SYNC_TRACKS_MANUALLY)) {
        BackgroundLocation.sync();
        log.debug('[BackgroundGeolocation HeadlessTask] - Manually sync observations...');
      }
      break;
    default:
      break;
  }
};

let getCurrentPosition = async () => {
  const location = await BackgroundLocation.getCurrentPosition({
    samples: 1,
    persist: true,
  });
  return location;
};

const RNRedux = () => {
  useEffect(() => {
    if (IS_IOS) {
      StatusBar.setBarStyle('dark-content', true);
    }
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER;
    View.defaultProps = View.defaultProps || {};
    View.defaultProps.maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER;
    TouchableOpacity.defaultProps = TouchableOpacity.defaultProps || {};
    TouchableOpacity.defaultProps.activeOpacity = 0.6;
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

// Load React Native UI Library custom design system
loadReactNativeUILibraryConfiguration();

BackgroundLocation.registerHeadlessTask(headlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
