import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import global_en from './translations/en/global.json';
import global_es from './translations/es/global.json';

i18n 
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    interpolation: {escapeValue: false},
    fallbackLng: 'en',
    debug: false,
    resources: {
        en: {
            global: global_en
        },
        es: {
            global: global_es
        }
    }
  });

export default i18n;