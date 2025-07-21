/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require("next-translate");

module.exports = nextTranslate({
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    legacyBrowsers: false,
    browsersListForSwc: true,
    nextScriptWorkers: false
  }
});
