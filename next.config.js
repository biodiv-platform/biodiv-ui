/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require("next-translate");
const { SITE } = require("./src/configs/site-config");

const siteUrl = new URL(SITE.URL);
const mainDomain = siteUrl.hostname;

module.exports = nextTranslate({
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    esmExternals: 'loose', // or true
    legacyBrowsers: false,
    browsersListForSwc: true,
    nextScriptWorkers: false
  },
  images: {
    remotePatterns: [
      // Main domain
      {
        protocol: siteUrl.protocol.replace(":", ""),
        hostname: mainDomain,
        pathname: "/**"
      },
      // All subdomains
      {
        protocol: "https",
        hostname: `*.${mainDomain}`,
        pathname: "/**"
      }
    ]
  }
});
