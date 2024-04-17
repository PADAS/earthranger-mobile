import { MMKV } from 'react-native-mmkv';

export const localStorage = new MMKV({
  id: 'user-storage',
});

export const setStringForKey = (key: string, value: string) => {
  localStorage.set(key, value);
};

export const getStringForKey = (key: string) => (
  localStorage.getString(key)
);

export const setBoolForKey = (key: string, value: boolean) => {
  localStorage.set(key, value);
};

export const getBoolForKey = (key: string) => (
  localStorage.getBoolean(key)
);

export const setNumberForKey = (key: string, value: number) => {
  localStorage.set(key, value);
};

export const getNumberForKey = (key: string) => (
  localStorage.getNumber(key)
);
