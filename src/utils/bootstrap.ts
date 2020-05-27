import { defaultLocale } from "@configs/i18n/config";
import { isLocale } from "@configs/i18n/types";
import { axGetPages, axGroupList } from "@services/usergroup.service";
import { parseNookies } from "next-nookies-persist";
import { AppContext } from "next/app";

import { absoluteUrl } from "./basic";

export const getLang = (ctx) => {
  return typeof ctx.query.lang !== "string" || !isLocale(ctx.query.lang)
    ? defaultLocale
    : ctx.query.lang;
};

export const getNewsLetterMenu = (childs) => {
  return childs.map((l) => {
    const link = { name: l.title, to: `/page/${l.id}` };
    if (l.childs.length > 0) {
      return { ...link, rows: getNewsLetterMenu(l.childs) };
    }
    return link;
  });
};

export const processedInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  const aUrl = absoluteUrl(ctx.req).url;

  const groupInfo = await axGroupList(aUrl);

  const { data: rawPages } = await axGetPages();
  const pages = getNewsLetterMenu(rawPages);

  const lang = getLang(ctx);

  return {
    pageProps,
    lang,
    pages,
    nookies: parseNookies(ctx),
    ...groupInfo
  };
};
