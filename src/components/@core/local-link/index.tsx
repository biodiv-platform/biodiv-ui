import { defaultLocale } from "@configs/i18n/config";
import { useStoreState } from "easy-peasy";
import NextLink, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { parse, stringify } from "querystring";
import React, { cloneElement } from "react";

interface Props extends Omit<Omit<LinkProps, "href">, "as"> {
  href: string;
  as?: string;
  children?: any;
  className?: string;
  params?: Record<string, unknown>;
  prefixGroup?: boolean;
}

/**
 * This function will take raw URL and perform follow operations to ensure maximum `next/link` compatibility
 * 1. squash query params
 * 2. preserve `lang` on page url
 * 3. as URL passed are going to be absolute this will try to make it relative w/ removing domain prefix
 *
 * @param {*} href
 * @param {*} router
 * @param {*} [params={}]
 * @param {*} [prefixGroup]
 * @param {*} [currentGroup]
 * @returns {string}
 */
const getLocalPath = (href, router, params = {}, prefixGroup?, currentGroup?) => {
  const lang = router.query.lang || defaultLocale;

  const groupPrefixPath =
    currentGroup && prefixGroup && !href.startsWith("http") ? currentGroup + href : href;

  const cleanPath = groupPrefixPath.startsWith(currentGroup)
    ? groupPrefixPath.replace(/^.*\/\/[^\/]+/, "")
    : groupPrefixPath;

  return cleanPath + "?" + stringify({ ...parse(href.split("?")[1]), ...params, lang });
};

export function useLocalRouter() {
  const router = useRouter();
  const { webAddress } = useStoreState((s) => s.currentGroup);

  function push(href, prefixGroup = false, params = {}, useWindow = false) {
    const to = getLocalPath(href, router, params, prefixGroup, webAddress);
    to.startsWith("http") || useWindow ? window.location.assign(to) : router.push(to);
  }

  function link(href, prefixGroup = false, params = {}) {
    return getLocalPath(href, router, params, prefixGroup, webAddress);
  }

  return { ...router, push, link };
}

function LocalLink({ prefixGroup, params, ...props }: Props) {
  if (!props.href) {
    return props.children;
  }

  const { webAddress } = useStoreState((s) => s.currentGroup);
  const router = useRouter();
  const localPath = getLocalPath(props.href, router, params, prefixGroup, webAddress);

  return localPath.startsWith("http") ? (
    cloneElement(props.children, { ...props?.children?.props, href: localPath })
  ) : (
    <NextLink {...props} href={localPath} prefetch={false} passHref={true} />
  );
}

export default LocalLink;
