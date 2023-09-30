import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';

addLocaleData(enLocaleData);
addLocaleData(esLocaleData);

export const supportedLocales = ['en_US', 'es_ES'];