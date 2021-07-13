/* eslint-disable @typescript-eslint/no-var-requires */
const { LANG } = require("./src/configs/site-config");

module.exports = {
  defaultLocale: LANG.DEFAULT,
  locales: Object.keys(LANG.LIST),
  pages: {
    "*": ["common", "header", "auth", "form"],
    "/": ["home"],
    "rgx:/datatable/": ["datatable", "form", "observation"],
    "rgx:/document/": ["document", "filters", "activity"],
    "rgx:/group/": ["home", "group"],
    "rgx:/landscape/": ["landscape", "filters", "activity"],
    "rgx:/observation/": ["observation", "filters", "activity"],
    "rgx:/page/": ["page"],
    "rgx:/register": ["user"],
    "rgx:/species/": ["species", "filters", "activity"],
    "rgx:/user/": ["user"],
    "rgx:/user/leaderboard": ["leaderboard"]
  }
};
