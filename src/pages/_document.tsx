import SITE_CONFIG from "@configs/site-config";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

interface IDocumentProps {
  lang?;
  nonce?: string;
}

class MyDocument extends Document<IDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = ctx.req?.headers?.["x-nonce"];
    return { ...initialProps, nonce: Array.isArray(nonce) ? nonce[0] : nonce };
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html lang={this.props.__NEXT_DATA__?.props?.lang}>
        <Head nonce={nonce}>
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="description" content={SITE_CONFIG.SITE.DESCRIPTION} />
          <meta name="theme-color" content="#363636" />
          {nonce && <meta property="csp-nonce" content={nonce} />}
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
