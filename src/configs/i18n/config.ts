import SITE_CONFIG from "@configs/site-config.json";

const i18nConfig = {
  defaultLocale: SITE_CONFIG.LANG.DEFAULT,
  defaultLocaleId: SITE_CONFIG.LANG.DEFAULT_ID,
  locales: Object.keys(SITE_CONFIG.LANG.LIST),
  localesList: SITE_CONFIG.LANG.LIST
};

export default i18nConfig;
