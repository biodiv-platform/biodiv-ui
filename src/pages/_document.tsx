import { Locale } from "@configs/i18n/types";
import SITE_CONFIG from "@configs/site-config.json";
import { customTheme } from "@configs/theme";
import { jsontocss } from "@utils/style";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

interface IDocumentProps {
  lang?: Locale;
}

class MyDocument extends Document<IDocumentProps> {
  render() {
    return (
      <Html lang={this.props.__NEXT_DATA__?.props?.lang}>
        <Head>
          <style>{jsontocss(customTheme)}</style>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="description" content={SITE_CONFIG.SITE.DESCRIPTION} />
          <meta name="theme-color" content="#363636" />
        </Head>
        <body>
          <a className="start-of-content" href="#main">
            Skip to Content
          </a>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
