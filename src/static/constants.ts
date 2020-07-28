import SITE_CONFIG from "@configs/site-config.json";
import { UserGroupIbp } from "@interfaces/observation";

export const isBrowser = typeof window !== `undefined`;

export const DEFAULT_LANGUAGE_ID = 205;

const API_ENDPOINT = isBrowser ? SITE_CONFIG.SITE.API_ENDPOINT : SITE_CONFIG.SITE.API_ENDPOINT_SSR;

export const ENDPOINT = {
  RAW: `${API_ENDPOINT}biodiv`,
  API: `${API_ENDPOINT}biodiv-api`,
  NAKSHA: `${API_ENDPOINT}naksha-api/api`,
  USER: `${API_ENDPOINT}user-api/api`,
  ESMODULE: `${API_ENDPOINT}esmodule-api/api`,
  DOCUMENT: `${API_ENDPOINT}document-api/api`,
  ACTIVITY: `${API_ENDPOINT}activity-api/api`,
  OBSERVATION: `${API_ENDPOINT}observation-api/api`,
  RESOURCES: `${API_ENDPOINT}resources-api/api`,
  TAXONOMY: `${API_ENDPOINT}taxonomy-api/api`,
  TRAITS: `${API_ENDPOINT}traits-api/api`,
  USERGROUP: `${API_ENDPOINT}userGroup-api/api`,
  UTILITY: `${API_ENDPOINT}utility-api/api`,
  FILES: `${API_ENDPOINT}files-api/api`,
  GEOSERVER: `${API_ENDPOINT}geoserver`
};

export const DEFAULT_GROUP: UserGroupIbp = {
  id: null,
  icon: `${ENDPOINT.FILES}${SITE_CONFIG.SITE.ICON}`,
  name: SITE_CONFIG.SITE.TITLE,
  webAddress: SITE_CONFIG.SITE.URL
};

export const DATE_ACCURACY = {
  ACCURATE: "ACCURATE"
};

export const TOKEN = {
  BATOKEN: "BAToken",
  BRTOKEN: "BRToken",
  AUTH: "token",
  USER: "user",
  ACCESS: "access_token",
  REFRESH: "refresh_token",
  TIMEOUT: "timeout",
  TYPE: "Bearer "
};

export const TRAIT_TYPES = {
  SINGLE_CATEGORICAL: "SINGLE_CATEGORICAL",
  MULTIPLE_CATEGORICAL: "MULTIPLE_CATEGORICAL"
};

export const FLAG_OPTIONS = [
  "DETAILS_INAPPROPRIATE",
  "LOCATION_INAPPROPRIATE",
  "DATE_INAPPROPRIATE"
];

export const TAXON_BADGE_COLORS = {
  ACCEPTED: "green",
  WORKING: "orange",
  CLEAN: "green",
  RAW: "pink",
  SYNONYM: "purple"
};

export const PAGINATION_LIMIT = 3;

export const RESOURCE_SIZE = {
  PREVIEW: "?h=420",
  THUMBNAIL: "?h=34",
  LIST_THUMBNAIL: "?h=300",
  TWITTER: "?w=600&h=330&fit=center&preserve=true",
  APPLE_TOUCH: "?h=180&w=180&crop=fit&preserve=true",
  MANIFEST: "${icon}?h=${size}&w=${size}&crop=fit&preserve=true"
};

export const FORWARD_BLACKLIST = ["login", "register"];
