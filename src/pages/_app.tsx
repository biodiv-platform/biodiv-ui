import "../styles/global.css";

import { ChakraProvider } from "@chakra-ui/react";
import Footer from "@components/@core/container/footer";
import Metadata from "@components/@core/container/metadata";
import NavigationMenuDark from "@components/@core/navigation-menu/dark";
import NavigationMenuLight from "@components/@core/navigation-menu/light";
import SITE_CONFIG from "@configs/site-config";
import { GlobalStateProvider } from "@hooks/use-global-state";
import { UserGroupIbp } from "@interfaces/observation";
import { axGroupList } from "@services/app.service";
import { getParsedUser } from "@utils/auth";
import { absoluteUrl } from "@utils/basic";
import App, { AppContext } from "next/app";
import dynamic from "next/dynamic";
import Router from "next/router";
import NProgress from "nprogress";
import React, { useEffect } from "react";
import BusProvider from "react-gbus";

import Announcement from "@/components/@core/announcements";
import { Toaster } from "@/components/ui/toaster";
import { customTheme } from "@/configs/theme";
import { axGetActiveAnnouncement } from "@/services/utility.service";

const AuthWall = dynamic(() => import("@components/@core/container/authwall"), {
  ssr: false
});

interface AppProps {
  Component;
  currentGroup: UserGroupIbp;
  domain;
  groups: UserGroupIbp[];
  user;
  pageProps;
  pages;
  languageId;
  announcement;
}

function MainApp({
  Component,
  currentGroup,
  domain,
  groups,
  user,
  languageId,
  announcement,
  pageProps
}: AppProps) {
  const config = { header: true, footer: true, ...Component?.config };

  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, [Router]);

  return (
    <BusProvider>
      <ChakraProvider value={customTheme}>
        <Toaster />
        <GlobalStateProvider initialState={{ user, domain, groups, currentGroup, languageId, announcement }}>
          <Metadata />
          <div className="content">
            {config.header && (
              <>
                <NavigationMenuDark />
                <NavigationMenuLight />
                <Announcement/>
              </>
            )}
            <div id="main">
              <Component {...pageProps} />
            </div>
          </div>
          {config.footer && SITE_CONFIG.FOOTER.ACTIVE && <Footer />}
          <AuthWall />
        </GlobalStateProvider>
      </ChakraProvider>
    </BusProvider>
  );
}

MainApp.getInitialProps = async (appContext: AppContext) => {
  const { pageProps } = await App.getInitialProps(appContext);

  const aReq = absoluteUrl(appContext.ctx, appContext.router.asPath);
  const domain = aReq.hostname.split(".").slice(-2).join(".");
  const user = getParsedUser(appContext.ctx);
  const languageId = SITE_CONFIG.LANG.LIST[appContext.ctx.locale]?.ID;

  const { currentGroup, groups } = await axGroupList(aReq.href, languageId?languageId: SITE_CONFIG.LANG.DEFAULT_ID,appContext.ctx.locale);

  const { data: announcement } = await axGetActiveAnnouncement(appContext.ctx);

  return {
    pageProps,
    groups,
    currentGroup,
    domain,
    user,
    languageId,
    announcement
  };
};

export default MainApp;
