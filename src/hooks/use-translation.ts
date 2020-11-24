import i18nConfig from "@configs/i18n/config";
import { LocaleContext } from "@hooks/use-locale";
import { compiledMessage, getByPath } from "@utils/basic";
import { useContext } from "react";

export default function useTranslation() {
  const { locale, localeId, localesList, localeStrings, setLocale } = useContext(LocaleContext);

  function t(key: string, values?) {
    const translatedString = getByPath(localeStrings[locale], key);

    if (!translatedString) {
      console.warn(`Translation '${key}' for locale '${locale}' not found.`);
    }

    return compiledMessage(
      translatedString || getByPath(localeStrings[i18nConfig.defaultLocale], key) || key,
      values
    );
  }

  return {
    t,
    locale,
    localeId,
    localesList,

    setLocale
  };
}
