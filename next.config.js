/* eslint-disable @typescript-eslint/no-var-requires */
const nextTranslate = require("next-translate");

module.exports = nextTranslate({
  concurrentFeatures: true,
  experimental: { reactRoot: true }
});
