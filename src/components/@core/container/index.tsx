import SITE_CONFIG from "@configs/site-config.json";
import { GlobalStateProvider } from "@hooks/use-global-state";
import { UserGroupIbp } from "@interfaces/observation";
import { TOKEN } from "@static/constants";
import useNookies from "next-nookies-persist";
import dynamic from "next/dynamic";
import React from "react";

import AutoSync from "../autosync";
import NavigationMenuDark from "../navigation-menu/dark";
import NavigationMenuLight from "../navigation-menu/light";
import Feedback from "./feedback";
import Footer from "./footer";
import Metadata from "./metadata";

const AuthWall = dynamic(() => import("./authwall"), { ssr: false });

interface IAppContainerProps {
  extras: {
    Component;
    pageProps;
    pages;
    groups: UserGroupIbp[];
    currentGroup: UserGroupIbp;
    isCurrentGroupMember: boolean;
    canUserEdit: boolean;
    manifestURL: string;
  };
}

function AppContainer({ extras }: IAppContainerProps) {
  const {
    Component,
    pageProps,
    groups,
    currentGroup,
    pages,
    manifestURL,
    canUserEdit,
    isCurrentGroupMember
  } = extras;
  const config = { header: true, footer: true, ...Component?.config };
  const { nookies } = useNookies();

  return (
    <GlobalStateProvider
      initialState={{
        user: nookies[TOKEN.USER],
        groups,
        currentGroup,
        isCurrentGroupMember,
        canUserEdit,
        pages
      }}
    >
      <Metadata manifestURL={manifestURL} />
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
  );
}

export default AppContainer;
