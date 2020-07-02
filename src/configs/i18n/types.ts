import { locales } from "./config";

export type Locale = typeof locales[number];

export type Strings = {
  [key in Locale]: Record<string, unknown>;
};

export function isLocale(tested: string): tested is Locale {
  return locales.some((locale) => locale === tested);
}
