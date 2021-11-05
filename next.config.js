/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require("next-transpile-modules")([
  "d3-array",
  "d3-axis",
  "d3-color",
  "d3-format",
  "d3-interpolate",
  "d3-path",
  "d3-scale",
  "d3-selection",
  "d3-shape",
  "d3-time-format",
  "d3-time",
  "internmap"
]);

const nextTranslate = require("next-translate");

module.exports = nextTranslate(
  withTM({
    experimental: {
      esmExternals: false
    }
  })
);
