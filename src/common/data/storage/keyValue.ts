import { MMKV } from 'react-native-mmkv';

export const localStorage = new MMKV({
  id: 'user-storage',
});

export const setStringForKey = (key: string, value: string | undefined) => {
  if (value !== undefined) {
    localStorage.set(key, value);
  }
};

export const getStringForKey = (key: string): string | undefined => localStorage.getString(key);

export const setBoolForKey = (key: string, value: boolean | undefined) => {
  if (value !== undefined) {
    localStorage.set(key, value);
  }
};

export const getBoolForKey = (key: string): boolean | undefined => localStorage.getBoolean(key);

export const setNumberForKey = (key: string, value: number | undefined) => {
  if (value !== undefined) {
    localStorage.set(key, value);
  }
};

export const getNumberForKey = (key: string): number | undefined => localStorage.getNumber(key);
