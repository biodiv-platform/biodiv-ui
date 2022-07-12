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
          {SITE_CONFIG.TRACKING.ENABLED && (
            <script
              data-partytown-config
              dangerouslySetInnerHTML={{
                __html: `partytown = { lib: "/_next/static/~partytown/", forward: ["gtag"] };`
              }}
            />
          )}
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
