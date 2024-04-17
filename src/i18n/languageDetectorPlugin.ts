// External Dependencies
import { getLocales } from 'react-native-localize';

// Internal Dependencies
import { STORE_LANGUAGE_KEY } from '../common/constants/constants';
import { setStringForKey } from '../common/data/storage/keyValue';
import log from '../common/utils/logUtils';

const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect(callback: (lang: string) => void) {
    const locales = getLocales();
    log.info('Locale:', locales[0].languageCode);
    return callback(locales[0].languageCode);
  },
  cacheUserLanguage(lang: string) {
    setStringForKey(STORE_LANGUAGE_KEY, lang);
  },
};

export { languageDetectorPlugin };
