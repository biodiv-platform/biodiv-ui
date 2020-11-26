import "@styles/global.scss";

import { ChakraProvider } from "@chakra-ui/react";
import Feedback from "@components/@core/container/feedback";
import Footer from "@components/@core/container/footer";
import Metadata from "@components/@core/container/metadata";
import NavigationMenuDark from "@components/@core/navigation-menu/dark";
import NavigationMenuLight from "@components/@core/navigation-menu/light";
import SITE_CONFIG from "@configs/site-config.json";
import { customTheme } from "@configs/theme";
import { GlobalStateProvider } from "@hooks/use-global-state";
import { LocaleProvider } from "@hooks/use-locale";
import { UserGroupIbp } from "@interfaces/observation";
import { axCheckUserGroupMember, axGroupList } from "@services/usergroup.service";
import { TOKEN } from "@static/constants";
import { absoluteUrl } from "@utils/basic";
import { getLang } from "@utils/lang";
import { NookiesProvider, parseNookies } from "next-nookies-persist";
import App, { AppContext } from "next/app";
import dynamic from "next/dynamic";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";
import BusProvider from "react-gbus";

const AuthWall = dynamic(() => import("@components/@core/container/authwall"), { ssr: false });
const AutoSync = dynamic(() => import("@components/@core/autosync"), { ssr: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface AppProps {
  Component;
  currentGroup: UserGroupIbp;
  domain;
  groups: UserGroupIbp[];
  isCurrentGroupMember: boolean;
  lang;
  nookies;
  pageProps;
  pages;
}

function MainApp({
  Component,
  currentGroup,
  domain,
  groups,
  isCurrentGroupMember,
  lang,
  nookies,
  pageProps
}: AppProps) {
  const config = { header: true, footer: true, ...Component?.config };

  return (
    <BusProvider>
      <LocaleProvider lang={lang}>
        <NookiesProvider initialValue={nookies} options={{ domain }}>
          <ChakraProvider theme={customTheme}>
            <GlobalStateProvider
              initialState={{
                user: nookies[TOKEN.USER],
                groups,
                currentGroup,
                isCurrentGroupMember
              }}
            >
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
        </NookiesProvider>
      </LocaleProvider>
    </BusProvider>
  );
}

MainApp.getInitialProps = async (appContext: AppContext) => {
  const { pageProps } = await App.getInitialProps(appContext);

  const aReq = absoluteUrl(appContext.ctx, appContext.router.asPath);
  const domain = aReq.hostname.split(".").slice(-2).join(".");
  const nookies = parseNookies(appContext.ctx);

  const { currentGroup, groups } = await axGroupList(aReq.href);
  const isCurrentGroupMember = await axCheckUserGroupMember(
    currentGroup.id,
    nookies?.[TOKEN.USER]?.id,
    appContext.ctx
  );

  const lang = getLang(appContext.ctx);

  return {
    pageProps,
    lang,
    groups,
    currentGroup,
    isCurrentGroupMember,
    domain,
    nookies
  };
};

export default MainApp;
