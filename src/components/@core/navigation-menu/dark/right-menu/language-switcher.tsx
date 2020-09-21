import useTranslation from "@hooks/use-translation";
import React from "react";

export default function LanguageSwitcher() {
  const { localesList, locale, setLocale } = useTranslation();

  const handleOnLanguageChange = (e) => setLocale(e.target.value);

  return (
    <select
      name="language"
      aria-label="change language"
      value={locale}
      onChange={handleOnLanguageChange}
    >
      {Object.keys(localesList).map((lang) => (
        <option key={lang} value={lang}>
          {localesList[lang].NAME}
        </option>
      ))}
    </select>
  );
}
