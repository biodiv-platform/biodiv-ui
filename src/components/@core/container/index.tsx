import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import { UserGroupIbp } from "@interfaces/observation";
import { isBrowser, RESOURCE_SIZE, TOKEN } from "@static/constants";
import authStore from "@stores/auth.store";
import { CACHE_WHITELIST, removeCache } from "@utils/auth";
import { createStore, StoreProvider } from "easy-peasy";
import useNookies from "next-nookies-persist";
import { DefaultSeo } from "next-seo";
import dynamic from "next/dynamic";
import Head from "next/head";
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
    manifestURL: string;
  };
}

function AppContainer({ extras }: IAppContainerProps) {
  const { Component, pageProps, groups, currentGroup, pages, manifestURL } = extras;
  const config = { header: true, footer: true, ...Component?.config };
  const { nookies } = useNookies();
  const router = useRouter();
  const initialState = { user: nookies[TOKEN.USER] || {}, groups, currentGroup, pages };
  const hybridStore = createStore(authStore, { initialState });
  const { locale } = useTranslation();
  const canonical = SITE_CONFIG.SITE.URL + router.asPath;

  useEffect(() => {
    if (isBrowser && SITE_CONFIG.TRACKING.ENABLED) {
      ReactGA.initialize(SITE_CONFIG.TRACKING.GA_ID);
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
        description={SITE_CONFIG.SITE.DESCRIPTION}
        openGraph={{
          type: "website",
          locale,
          url: canonical,
          title: currentGroup.name,
          site_name: currentGroup.name,
          description: SITE_CONFIG.SITE.DESCRIPTION
        }}
        twitter={{
          handle: SITE_CONFIG.FOOTER.SOCIAL.TWITTER.HANDLE,
          site: SITE_CONFIG.FOOTER.SOCIAL.TWITTER.HANDLE,
          cardType: "summary_large_image"
        }}
      />
      <Head>
        <link rel="apple-touch-icon" href={currentGroup.icon + RESOURCE_SIZE.APPLE_TOUCH} />
        <link rel="manifest" href={manifestURL} />
      </Head>
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
        {SITE_CONFIG.FEEDBACK.ACTIVE && <Feedback />}
      </div>
      {config.footer && SITE_CONFIG.FOOTER.ACTIVE && <Footer />}
      <AuthWall />
    </StoreProvider>
  );
}

export default AppContainer;
