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
    "rgx:/map": ["page"],
    "rgx:/observation/": ["observation", "datatable", "filters", "activity"],
    "rgx:/page/": ["page"],
    "rgx:/register": ["user"],
    "rgx:/roles/": ["filters", "taxon"],
    "rgx:/species/": ["observation", "species", "filters", "activity", "taxon"],
    "rgx:/taxonomy/": ["activity", "filters", "taxon", "species"],
    "rgx:/user/": ["user", "group", "filters"],
    "rgx:/user/leaderboard": ["leaderboard"]
  }
};
