import i18nConfig from "@configs/i18n/config";
import { isLocale } from "@configs/i18n/types";

export const getLang = (ctx) => {
  return typeof ctx.query.lang !== "string" || !isLocale(ctx.query.lang)
    ? i18nConfig.defaultLocale
    : ctx.query.lang;
};

export const getLangId = (ctx) => i18nConfig.localesList[getLang(ctx)].ID;
