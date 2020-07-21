import SITE_CONFIG from "@configs/site-config.json";

export const defaultLocale = SITE_CONFIG.LANG.DEFAULT;

export const locales = Object.keys(SITE_CONFIG.LANG.LIST);

export const languageNames = SITE_CONFIG.LANG.LIST;
