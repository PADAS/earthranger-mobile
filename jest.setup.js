// Internal Dependencies
import { NativeModules as RNNativeModules } from 'react-native';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import { resources as mockTranslations } from './i18n.config';

require('@shopify/flash-list/jestSetup');

// device info
jest.mock('react-native-device-info', () => mockRNDeviceInfo);

// NetInfo
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

// React Native File System
jest.mock('react-native-fs', () => ({
  exists: jest.fn(),
  mkdir: jest.fn(),
  readDir: jest.fn(),
  unlink: jest.fn(),
  appendFile: jest.fn(),
  DocumentDirectoryPath: jest.fn(),
}));

// MMKV
jest.mock('react-native-mmkv');

// i18n
function mockGetTranslation(key, obj = mockTranslations.en.translation) {
  return key.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj || null);
}

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  useTranslation: () => ({
    t: (str) => mockGetTranslation(str),
  }),
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [{
    countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false,
  }],
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Firebase Analytics
jest.mock('@react-native-firebase/analytics', () => ({
  log: jest.fn(),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  setAttribute: jest.fn(),
}));

// Native Modules - react-native-gesture-handler
RNNativeModules.UIManager = RNNativeModules.UIManager || {};
RNNativeModules.UIManager.RCTView = RNNativeModules.UIManager.RCTView || {};
RNNativeModules.RNGestureHandlerModule = RNNativeModules.RNGestureHandlerModule || {
  State: {
    BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END',
  },
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),

};
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
  forceTouchAvailable: false,
};
