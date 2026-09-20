import { LanguageOption, TranslationDictionary } from './types';
export type { LanguageOption, TranslationDictionary };

import { as } from './i18n/as';
import { bgc } from './i18n/bgc';
import { bn } from './i18n/bn';
import { brx } from './i18n/brx';
import { doi } from './i18n/doi';
import { en } from './i18n/en';
import { gu } from './i18n/gu';
import { hi } from './i18n/hi';
import { kn } from './i18n/kn';
import { kok } from './i18n/kok';
import { ks } from './i18n/ks';
import { mai } from './i18n/mai';
import { ml } from './i18n/ml';
import { mni } from './i18n/mni';
import { mr } from './i18n/mr';
import { ne } from './i18n/ne';
import { or } from './i18n/or';
import { pa } from './i18n/pa';
import { sa } from './i18n/sa';
import { sat } from './i18n/sat';
import { sd } from './i18n/sd';
import { ta } from './i18n/ta';
import { te } from './i18n/te';
import { ur } from './i18n/ur';

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechLocale: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechLocale: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechLocale: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speechLocale: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speechLocale: 'ur-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', speechLocale: 'sa-IN' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', speechLocale: 'kok-IN' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', speechLocale: 'mai-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', speechLocale: 'mni-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', speechLocale: 'ne-NP' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', speechLocale: 'brx-IN' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', speechLocale: 'doi-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', speechLocale: 'ks-IN' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', speechLocale: 'sat-IN' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', speechLocale: 'sd-IN' },
  { code: 'bgc', name: 'Haryanvi', nativeName: 'हरियाणवी', speechLocale: 'hi-IN' }
];

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  en,
  ta,
  te,
  hi,
  kn,
  ml,
  mr,
  bn,
  gu,
  pa,
  or,
  as,
  ur,
  sa,
  kok,
  mai,
  mni,
  ne,
  brx,
  doi,
  ks,
  sat,
  sd,
  bgc
};

export function getTranslation(langCode: string): TranslationDictionary;
export function getTranslation(langCode: string, key: keyof TranslationDictionary): string;
export function getTranslation(langCode: string, key?: keyof TranslationDictionary): TranslationDictionary | string {
  const dictionary = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
  const merged: TranslationDictionary = {
    ...TRANSLATIONS['en'],
    ...dictionary,
  };
  if (key) {
    return merged[key] || TRANSLATIONS['en'][key] || (key as string);
  }
  return merged;
}


