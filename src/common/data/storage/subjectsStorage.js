/* eslint-disable class-methods-use-this */
import { camelCase } from 'lodash-es';
import MMKVStorage from './mmkvStorage';
import { STORAGE_KEYS } from '../../constants/constants';

class SubjectsStorage {
  constructor() {
    // Create getter and setter for each key
    Object.keys(STORAGE_KEYS).forEach((key) => {
      const camelCaseKey = camelCase(key);

      this[`${camelCaseKey}`] = {
        get: () => MMKVStorage.get(STORAGE_KEYS[key]),
        // eslint-disable-next-line no-setter-return
        set: (value) => MMKVStorage.set(STORAGE_KEYS[key], value),
      };
    });
  }

  clearUserData() {
    Object.values(STORAGE_KEYS).forEach((key) => MMKVStorage.remove(key));
  }

  // Method to add a new key
  addNewKey(keyName, value) {
    if (!STORAGE_KEYS[keyName]) {
      STORAGE_KEYS[keyName] = keyName;
      const lowercaseKey = keyName.charAt(0).toLowerCase() + keyName.slice(1);
      Object.defineProperty(this, lowercaseKey, {
        get: () => MMKVStorage.get(STORAGE_KEYS[keyName]),
        // eslint-disable-next-line no-setter-return
        set: (val) => MMKVStorage.set(STORAGE_KEYS[keyName], val),
      });
    }
    this[keyName.charAt(0).toLowerCase() + keyName.slice(1)] = value;
  }
}

export default new SubjectsStorage();
