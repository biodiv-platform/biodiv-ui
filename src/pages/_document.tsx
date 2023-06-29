import { ColorModeScript } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

interface IDocumentProps {
  lang?;
}

class MyDocument extends Document<IDocumentProps> {
  render() {
    return (
      <Html lang={this.props.__NEXT_DATA__?.props?.lang}>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="description" content={SITE_CONFIG.SITE.DESCRIPTION} />
          <meta name="theme-color" content="#363636" />
        </Head>
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
