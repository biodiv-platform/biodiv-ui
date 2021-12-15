import "../styles/global.scss";

import { ChakraProvider } from "@chakra-ui/react";
import Feedback from "@components/@core/container/feedback";
import Footer from "@components/@core/container/footer";
import Metadata from "@components/@core/container/metadata";
import NavigationMenuDark from "@components/@core/navigation-menu/dark";
import NavigationMenuLight from "@components/@core/navigation-menu/light";
import SITE_CONFIG from "@configs/site-config";
import { customTheme } from "@configs/theme";
import { GlobalStateProvider } from "@hooks/use-global-state";
import { UserGroupIbp } from "@interfaces/observation";
import { axGroupList } from "@services/usergroup.service";
import { getParsedUser } from "@utils/auth";
import { absoluteUrl } from "@utils/basic";
import App, { AppContext } from "next/app";
import dynamic from "next/dynamic";
import Router from "next/router";
import NProgress from "nprogress";
import React, { useEffect } from "react";
import BusProvider from "react-gbus";

const AuthWall = dynamic(() => import("@components/@core/container/authwall"), { ssr: false });
const AutoSync = dynamic(() => import("@components/@core/autosync"), { ssr: false });

interface AppProps {
  Component;
  currentGroup: UserGroupIbp;
  domain;
  groups: UserGroupIbp[];
  user;
  pageProps;
  pages;
}

function MainApp({ Component, currentGroup, domain, groups, user, pageProps }: AppProps) {
  const config = { header: true, footer: true, ...Component?.config };

  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, [Router]);

  return (
    <BusProvider>
      <ChakraProvider theme={customTheme}>
        <GlobalStateProvider initialState={{ user, domain, groups, currentGroup }}>
          <Metadata />
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

  const { currentGroup, groups } = await axGroupList(aReq.href, appContext.ctx.locale);

  return {
    pageProps,
    groups,
    currentGroup,
    domain,
    user
  };
};

export default MainApp;
