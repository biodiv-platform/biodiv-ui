import { Locale } from "@configs/i18n/types";
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
          <meta name="description" content={process.env.NEXT_PUBLIC_META_DESCRIPTION} />
          <meta name="theme-color" content="#363636" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
