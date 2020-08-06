import SITE_CONFIG from "@configs/site-config.json";

export const STATIC_GROUP_PAYLOAD = {
  languageId: SITE_CONFIG.LANG.DEFAULT_ID,
  sendDigestMail: true,
  homePage: null,
  domainName: null,
  theme: "default",
  newFilterRule: null
};
