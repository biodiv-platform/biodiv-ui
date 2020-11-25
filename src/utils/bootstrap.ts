import i18nConfig from "@configs/i18n/config";
import localeStrings from "@configs/i18n/strings";
import { isLocale } from "@configs/i18n/types";
import { axGetTree } from "@services/pages.service";
import { axCheckUserGroupMember, axGroupList } from "@services/usergroup.service";
import { TOKEN } from "@static/constants";
import { parseNookies } from "next-nookies-persist";
import { AppContext } from "next/app";

import { absoluteUrl } from "./basic";
import { getManifestURL } from "./userGroup";

export const getLang = (ctx) => {
  return typeof ctx.query.lang !== "string" || !isLocale(ctx.query.lang)
    ? i18nConfig.defaultLocale
    : ctx.query.lang;
};

export const getLangId = (ctx) => i18nConfig.localesList[getLang(ctx)].ID;

export const getPagesMenu = (children) => {
  return children.map((l) => {
    const link = { name: l.title, to: `/page/${l.id}` };
    if (l.children.length > 0) {
      return { ...link, rows: getPagesMenu(l.children) };
    }
    return link;
  });
};

export function getLocaleStrings(lang) {
  const defaultLocaleStrings = localeStrings[i18nConfig.defaultLocale];
  return lang === i18nConfig.defaultLocale
    ? {
        [lang]: defaultLocaleStrings
      }
    : {
        [lang]: localeStrings[lang],
        [i18nConfig.defaultLocale]: defaultLocaleStrings
      };
}

export const processedInitialProps = async ({ Component, ctx, router }: AppContext) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  const aReq = absoluteUrl(ctx, router.asPath);
  const domain = aReq.hostname.split(".").slice(-2).join(".");
  const nookies = parseNookies(ctx);
  const userId = nookies?.[TOKEN.USER]?.id;

  const { currentGroup, groups } = await axGroupList(aReq.href);
  const isCurrentGroupMember = await axCheckUserGroupMember(currentGroup.id, userId, ctx);
  const manifestURL = getManifestURL(currentGroup);

  const { data: rawPages } = await axGetTree(currentGroup?.id);
  const pages = getPagesMenu(rawPages);

  const lang = getLang(ctx);
  const localeStrings = await getLocaleStrings(lang);

  return {
    pageProps,
    lang,
    localeStrings,
    pages,
    groups,
    currentGroup,
    isCurrentGroupMember,
    manifestURL,
    domain,
    nookies
  };
};
