import { License } from "@interfaces/custom";

export const DEFAULT_LICENSE = "822";

export const LICENSES: { [key: string]: License } = {
  821: { name: "CC_PUBLIC_DOMAIN", link: "http://creativecommons.org/licenses/publicdomain/" },
  822: { name: "CC_BY", link: "http://creativecommons.org/licenses/by/3.0/" },
  823: { name: "CC_BY_SA", link: "http://creativecommons.org/licenses/by-sa/3.0/" },
  824: { name: "CC_BY_ND", link: "http://creativecommons.org/licenses/by-nd/3.0/" },
  825: { name: "CC_BY_NC", link: "http://creativecommons.org/licenses/by-nc/3.0/" },
  826: { name: "CC_BY_NC_SA", link: "http://creativecommons.org/licenses/by-nc-sa/3.0/" },
  827: { name: "CC_BY_NC_ND", link: "http://creativecommons.org/licenses/by-nc-nd/3.0/" },
  828: { name: "UNSPECIFIED", link: "" }
};

export const LICENSES_ARRAY = Object.keys(LICENSES).map((id) => ({
  value: id,
  label: LICENSES[id].name.split("_").join(" ")
}));
