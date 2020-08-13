import SITE_CONFIG from "@configs/site-config.json";

export const defaultLocale = SITE_CONFIG.LANG.DEFAULT;

export const defaultLocaleId = SITE_CONFIG.LANG.DEFAULT_ID;

export const locales = Object.keys(SITE_CONFIG.LANG.LIST);

export const localesList = SITE_CONFIG.LANG.LIST;
