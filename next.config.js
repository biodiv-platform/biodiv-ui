/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require("next-translate");

module.exports = nextTranslate({
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
    nextScriptWorkers: false
  }
});
