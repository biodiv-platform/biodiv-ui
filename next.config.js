/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require("next-pwa");
const { nanoid } = require("nanoid");
const SITE_CONFIG = require("./src/configs/site-config.json");

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

module.exports = withTM(
  withPWA({
    future: {
      webpack5: true
    },
    pwa: {
      dest: "public",
      disable: process.env.NODE_ENV !== "production" || !SITE_CONFIG.OFFLINE.ACTIVE,
      ignoreURLParametersMatching: [/^lang/, /^h/, /^w/, /^forward/],
      additionalManifestEntries: [
        { url: "/", revision: nanoid() },
        { url: "/login", revision: nanoid() },
        { url: "/observation/create", revision: nanoid() },
        { url: "/observation/recreate", revision: nanoid() }
      ],
      runtimeCaching: [
        {
          urlPattern: "/",
          handler: "NetworkFirst",
          options: {
            cacheName: "start-url",
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
            }
          }
        },
        {
          urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff2)/i,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "v2-static-assets",
            expiration: {
              maxEntries: 1000,
              maxAgeSeconds: 7 * 24 * 60 * 60 // 7 Days
            },
            cacheableResponse: {
              statuses: [0, 200, 304]
            }
          }
        },
        {
          urlPattern: /^https?.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "v2-light-cache",
            networkTimeoutSeconds: 15,
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 6 * 60 * 60 // 6 Hours
            },
            cacheableResponse: {
              statuses: [0, 200, 204, 404]
            }
          }
        }
      ]
    }
  })
);
