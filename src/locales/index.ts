/* eslint-disable no-unused-expressions */
import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';
import enTranslate from './en-US';
import pt from './pt-BR';

const getLanguageByDevice = () => {
  return RNLocalize.getLocales()[0].languageTag;
};

const normalizeTranslate: any = {
  'en-US': 'en-US',
  'pt-BR': 'pt-BR',
  en: 'en-US',
  'pt-US': 'pt-BR',
  'en-ES': 'en-US',
};
const enLang = new RegExp('en-*');
const ptLang = new RegExp('pt-*');
I18n.translations = {
  'en-US': enTranslate,
  'pt-BR': pt,
};

const setLanguageToI18n = () => {
  const language = getLanguageByDevice();
  console.log(
    '🚀 ~ file: index.ts ~ line 27 ~ setLanguageToI18n ~ language',
    language,
  );
  const isMatchEn = enLang.test(language);
  const isMatchPt = ptLang.test(language);

  const translateNormalize = normalizeTranslate[language];

  // eslint-disable-next-line no-prototype-builtins
  const iHaveThisLanguage = I18n.translations.hasOwnProperty(
    translateNormalize,
  );
  if (!iHaveThisLanguage) {
    isMatchPt && (I18n.locale = 'pt-BR');
    isMatchEn && (I18n.locale = 'en-US');
    I18n.defaultLocale = 'en-US';
  } else {
    I18n.locale = translateNormalize;
  }
};

setLanguageToI18n();

export const translate = (key: any) => I18n.t(key);
