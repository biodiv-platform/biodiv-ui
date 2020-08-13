import { defaultLocale, localesList } from "@configs/i18n/config";
import { isLocale } from "@configs/i18n/types";
import { axGetPages, axGroupList } from "@services/usergroup.service";
import { parseNookies } from "next-nookies-persist";
import { AppContext } from "next/app";

import { absoluteUrl } from "./basic";
import { getManifestURL } from "./userGroup";

export const getLang = (ctx) => {
  return typeof ctx.query.lang !== "string" || !isLocale(ctx.query.lang)
    ? defaultLocale
    : ctx.query.lang;
};

export const getLangId = (ctx) => localesList[getLang(ctx)].ID;

export const getNewsLetterMenu = (childs) => {
  return childs.map((l) => {
    const link = { name: l.title, to: `/page/${l.id}` };
    if (l.childs.length > 0) {
      return { ...link, rows: getNewsLetterMenu(l.childs) };
    }
    return link;
  });
};

export const getLocaleStrings = async (lang) => {
  const localeStrings = await import(`../i18n/${lang}.json`);

  if (lang !== defaultLocale) {
    const defaultLocaleStrings = await import(`../i18n/${defaultLocale}.json`);

    return { [defaultLocale]: defaultLocaleStrings, [lang]: localeStrings };
  }

  return { [lang]: localeStrings };
};

export const processedInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  const aReq = absoluteUrl(ctx.req);
  const domain = aReq.hostname.split(".").slice(-2).join(".");

  const { currentGroup, groups } = await axGroupList(aReq.href);
  const manifestURL = getManifestURL(currentGroup);

  const { data: rawPages } = await axGetPages(currentGroup?.id);
  const pages = getNewsLetterMenu(rawPages);

  const lang = getLang(ctx);
  const localeStrings = await getLocaleStrings(lang);

  return {
    pageProps,
    lang,
    localeStrings,
    pages,
    groups,
    currentGroup,
    manifestURL,
    domain,
    nookies: parseNookies(ctx)
  };
};
