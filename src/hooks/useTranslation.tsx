import React from "react";

import { defaultLocale, defaultLocaleId, localesList } from "../configs/i18n/config";
import { Locale } from "../configs/i18n/types";

interface ContextProps {
  locale: Locale;
  localeId;
  localesList;

  setLocale: (locale: Locale) => void;
  localeStrings: any;
}

export const LocaleContext = React.createContext<ContextProps>({
  locale: defaultLocale,
  localeId: defaultLocaleId,
  localesList,

  setLocale: () => null,
  localeStrings: {}
});

export const LocaleProvider: React.FC<{ lang: Locale; localeStrings: any }> = ({
  lang,
  children,
  localeStrings
}) => {
  const updateLocale = (locale) => {
    const params = new URLSearchParams(window.location.search);
    params.set("lang", locale);
    window.location.assign(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <LocaleContext.Provider
      value={{
        locale: lang,
        localeId: localesList[lang].ID,
        localesList,

        setLocale: updateLocale,
        localeStrings
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};
