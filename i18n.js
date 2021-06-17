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
    "/group/[groupName]/edit": ["group"],
    "rgx:/datatable/": ["datatable"],
    "rgx:/observation/": ["observation", "filters", "activity"],
    "rgx:/species/": ["species", "filters", "activity"],
    "rgx:/document/": ["document", "filters", "activity"],
    "rgx:/register": ["user"],
    "rgx:/user/": ["user"]
  }
};
