/* eslint-disable class-methods-use-this */
import { storage } from './storage';

class MMKVStorage {
  get(key) {
    return storage.getString(key);
  }

  set(key, value) {
    storage.set(key, value);
  }

  remove(key) {
    storage.delete(key);
  }

  clear() {
    storage.clearAll();
  }
}

export default new MMKVStorage();
