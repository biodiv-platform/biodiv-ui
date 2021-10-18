import SITE_CONFIG from "@configs/site-config";

export const getLanguageId = (lang) => SITE_CONFIG.LANG.LIST[lang];

export const translateOptions = (t, options) => options.map((o) => ({ ...o, label: t(o.label) }));

export const getLanguageNameById = (langId) =>
  Object.values(SITE_CONFIG.LANG.LIST).find(({ ID }) => ID === langId)?.NAME;
