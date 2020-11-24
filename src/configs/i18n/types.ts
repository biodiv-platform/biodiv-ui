import i18nConfig from "./config";

export type Locale = typeof i18nConfig.locales[number];

export type Strings = {
  [key in Locale]: Record<string, unknown>;
};

export function isLocale(tested: string): tested is Locale {
  return i18nConfig.locales.some((locale) => locale === tested);
}
