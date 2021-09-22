/* eslint-disable @typescript-eslint/no-var-requires */
const { LANG } = require("./src/configs/site-config");

module.exports = {
  defaultLocale: LANG.DEFAULT,
  locales: Object.keys(LANG.LIST),
  pages: {
    "*": ["common", "header", "auth", "form"],
    "/": ["home"],
    "/group/[groupName]": ["home"],
    "/group/[groupName]/show": ["home"],
    "rgx:/datatable/": ["activity", "datatable", "form", "observation"],
    "rgx:/document/": ["document", "filters", "activity"],
    "rgx:/group/": ["group"],
    "rgx:/landscape/": ["landscape", "observation", "filters", "activity"],
    "rgx:/observation/": ["observation", "filters", "activity"],
    "rgx:/page/": ["page"],
    "rgx:/roles/": ["filters", "taxon"],
    "rgx:/register": ["user"],
    "rgx:/species/": ["observation", "species", "filters", "activity"],
    "rgx:/taxonomy/": ["activity", "filters", "taxon", "species"],
    "rgx:/user/": ["user", "group","filters"],
    "rgx:/user/leaderboard": ["leaderboard"]
  }
};
