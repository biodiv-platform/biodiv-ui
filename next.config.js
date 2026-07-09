const nextTranslate = require("next-translate-plugin");
const { SITE } = require("./src/configs/site-config");
const siteUrl = new URL(SITE.SSR_URL);
const mainDomain = siteUrl.hostname;

module.exports = nextTranslate({
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    nextScriptWorkers: false
  },
  images: {
    dangerouslyAllowLocalIP: !!process.env.NEXT_PUBLIC_DEV_LOCAL_HOSTS,
    remotePatterns: [
      {
        protocol: siteUrl.protocol.replace(":", ""),
        hostname: mainDomain,
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: `*.${mainDomain}`,
        pathname: "/**"
      }
    ]
  }
}, { turbopack: true });