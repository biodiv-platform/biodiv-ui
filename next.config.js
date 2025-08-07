/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require("next-translate");

module.exports = nextTranslate({
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    legacyBrowsers: false,
    browsersListForSwc: true,
    nextScriptWorkers: false,
  },
  images: {
    remotePatterns: [
      // Always allow localhost
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      // Only add production domain if env var is set
      ...(process.env.NEXT_PUBLIC_SITE_URL ? [{
        protocol: "https",
        hostname: `**.${new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname.replace("www.", "")}`,
        pathname: "/**",
      }] : []),
    ],
  },
});