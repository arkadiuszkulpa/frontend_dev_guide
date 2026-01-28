import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enForm from './locales/en/form.json';
import plCommon from './locales/pl/common.json';
import plForm from './locales/pl/form.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: enCommon,
    form: enForm,
  },
  pl: {
    common: plCommon,
    form: plForm,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl'],

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
