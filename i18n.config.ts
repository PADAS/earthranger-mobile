// External Dependencies
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Internal Dependencies
import {
  en, es, fr, pt, sw,
} from './src/i18n';
import { languageDetectorPlugin } from './src/i18n/languageDetectorPlugin';

export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  pt: {
    translation: pt,
  },
  sw: {
    translation: sw,
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    compatibilityJSON: 'v3',
    resources,
    // language to use if translations in user language are not available
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
