import { useContext } from "react";

import { LocaleContext } from "../../hooks/useTranslation";
import { defaultLocale } from "./config";
import strings from "./strings";

export default function useTranslation() {
  const { locale } = useContext(LocaleContext);

  function t(key: string) {
    if (!strings[locale][key]) {
      console.warn(`Translation '${key}' for locale '${locale}' not found.`);
    }
    return strings[locale][key] || strings[defaultLocale][key] || key;
  }

  return {
    t,
    locale
  };
}
