/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require("next-translate");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
const siteHostname = siteUrl ? new URL(siteUrl).hostname.replace('www.', '') : '';

module.exports = nextTranslate({
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    legacyBrowsers: false,
    browsersListForSwc: true,
    nextScriptWorkers: false,
  },
  images: {
    domains: siteHostname ? [siteHostname] : [],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      ...(siteHostname ? [
        {
          protocol: 'https',
          hostname: siteHostname,
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: `*.${siteHostname}`,
          port: '',
          pathname: '/**',
        }
      ] : []),
    ],
  },
});