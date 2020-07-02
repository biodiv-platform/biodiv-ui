import { compiledMessage, getByPath } from "@utils/basic";
import { useContext } from "react";

import { LocaleContext } from "../../hooks/useTranslation";
import { defaultLocale } from "./config";
import strings from "./strings";

export default function useTranslation() {
  const { locale } = useContext(LocaleContext);

  function t(key: string, values?) {
    const translatedString = getByPath(strings[locale], key);

    if (!translatedString) {
      console.warn(`Translation '${key}' for locale '${locale}' not found.`);
    }

    return compiledMessage(
      translatedString || getByPath(strings[defaultLocale], key) || key,
      values
    );
  }

  return {
    t,
    locale
  };
}
