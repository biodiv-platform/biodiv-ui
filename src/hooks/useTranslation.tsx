import { useRouter } from "next/router";
import React from "react";

import { defaultLocale } from "../configs/i18n/config";
import { isLocale, Locale } from "../configs/i18n/types";

interface ContextProps {
  readonly locale: Locale;
  readonly setLocale: (locale: Locale) => void;
  localeStrings: any;
}

export const LocaleContext = React.createContext<ContextProps>({
  locale: defaultLocale,
  setLocale: () => null,
  localeStrings: {}
});

export const LocaleProvider: React.FC<{ lang: Locale; localeStrings: any }> = ({
  lang,
  children,
  localeStrings
}) => {
  const [locale, setLocale] = React.useState(lang);
  const { query } = useRouter();

  if (typeof query.lang === "string" && isLocale(query.lang) && locale !== query.lang) {
    setLocale(query.lang);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, localeStrings }}>
      {children}
    </LocaleContext.Provider>
  );
};
