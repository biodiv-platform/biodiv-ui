import useTranslation from "@configs/i18n/useTranslation";
import { UserGroupIbp } from "@interfaces/observation";
import { isBrowser, TOKEN } from "@static/constants";
import authStore from "@stores/auth.store";
import { CACHE_WHITELIST, removeCache } from "@utils/auth";
import { createStore, StoreProvider } from "easy-peasy";
import useNookies from "next-nookies-persist";
import { DefaultSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ReactGA from "react-ga";

import AutoSync from "../autosync";
import NavigationMenuDark from "../navigation-menu/dark";
import NavigationMenuLight from "../navigation-menu/light";
import Feedback from "./feedback";
import Footer from "./footer";

const AuthWall = dynamic(() => import("./authwall"), { ssr: false });

interface IAppContainerProps {
  extras: {
    Component;
    pageProps;
    pages;
    groups: UserGroupIbp[];
    currentGroup: UserGroupIbp;
  };
}

function AppContainer({ extras }: IAppContainerProps) {
  const { Component, pageProps, groups, currentGroup, pages } = extras;
  const config = { header: true, footer: true, ...Component?.config };
  const { nookies } = useNookies();
  const router = useRouter();
  const initialState = { user: nookies[TOKEN.USER] || {}, groups, currentGroup, pages };
  const hybridStore = createStore(authStore, { initialState });
  const { t, locale } = useTranslation();
  const canonical = process.env.NEXT_PUBLIC_SITE_URL + router.asPath;

  useEffect(() => {
    if (isBrowser) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
      removeCache(CACHE_WHITELIST);
    }
  }, []);

  useEffect(() => {
    ReactGA.pageview(router.asPath);
  }, [router.asPath]);

  return (
    <StoreProvider store={hybridStore}>
      <DefaultSeo
        title={currentGroup.name}
        canonical={canonical}
        description={t("HOME.BANNER_DESCRIPTION")}
        openGraph={{
          type: "website",
          locale,
          url: canonical,
          title: currentGroup.name,
          site_name: currentGroup.name,
          description: t("HOME.BANNER_DESCRIPTION")
        }}
        twitter={{
          handle: process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
          site: process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
          cardType: "summary_large_image"
        }}
      />
      <div className="content">
        {config.header && (
          <>
            <NavigationMenuDark />
            <NavigationMenuLight />
          </>
        )}
        <AutoSync />
        <div id="main">
          <Component {...pageProps} />
        </div>
        <Feedback />
      </div>
      {config.footer && <Footer />}
      <AuthWall />
    </StoreProvider>
  );
}

export default AppContainer;
