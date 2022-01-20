/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

const nextTranslate = require("next-translate");

module.exports = withBundleAnalyzer(
  nextTranslate({
    concurrentFeatures: true
  })
);
