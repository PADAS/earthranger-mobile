// External Dependencies
import Config from 'react-native-config';
import { MMKV } from 'react-native-mmkv';

export const localStorageSecured = new MMKV({
  id: 'user-secure-storage',
  encryptionKey: Config.MMKV_ENCRYPTION_KEY,
});

export const setSecuredStringForKey = (key: string, value: string) => {
  localStorageSecured.set(key, value);
};

export const getSecuredStringForKey = (key: string) => (localStorageSecured.getString(key));
