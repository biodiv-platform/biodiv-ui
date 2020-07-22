import "@styles/global.scss";

import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import AppContainer from "@components/@core/container";
import { customTheme } from "@configs/theme";
import { LocaleProvider } from "@hooks/useTranslation";
import { processedInitialProps } from "@utils/bootstrap";
import { NookiesProvider } from "next-nookies-persist";
import Router from "next/router";
import NProgress from "nprogress";
import React from "react";
import BusProvider from "react-gbus";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function App(props) {
  const { lang, nookies, localeStrings, domain, ...extras } = props;

  return (
    <BusProvider>
      <ThemeProvider theme={customTheme}>
        <LocaleProvider lang={lang} localeStrings={localeStrings}>
          <NookiesProvider initialValue={nookies} options={{ domain }}>
            <CSSReset />
            <AppContainer extras={extras} />
          </NookiesProvider>
        </LocaleProvider>
      </ThemeProvider>
    </BusProvider>
  );
}

App.getInitialProps = processedInitialProps;

export default App;
