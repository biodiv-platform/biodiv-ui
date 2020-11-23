import React from "react";

import i18nConfig from "../configs/i18n/config";
import { Locale } from "../configs/i18n/types";

interface ContextProps {
  locale: Locale;
  localeId;
  localesList;

  setLocale: (locale: Locale) => void;
  localeStrings: any;
}

export const LocaleContext = React.createContext<ContextProps>({
  locale: i18nConfig.defaultLocale,
  localeId: i18nConfig.defaultLocaleId,
  localesList: i18nConfig.localesList,

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
        localeId: i18nConfig.localesList[lang].ID,
        localesList: i18nConfig.localesList,

        setLocale: updateLocale,
        localeStrings
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};
