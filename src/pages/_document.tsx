import { Locale } from "@configs/i18n/types";
import SITE_CONFIG from "@configs/site-config.json";
import { customTheme } from "@configs/theme";
import { getLang } from "@utils/bootstrap";
import { jsontocss } from "@utils/style";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

interface IDocumentProps {
  lang?: Locale;
}

class MyDocument extends Document<IDocumentProps> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const lang = getLang(ctx);
    return { ...initialProps, lang };
  }

  render() {
    return (
      <Html lang={this.props.lang}>
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
