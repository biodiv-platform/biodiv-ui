import SITE_CONFIG from "@configs/site-config";
import { UserGroupIbpExtended } from "@interfaces/custom";

import packageJson from "../../package.json";

export const isBrowser = typeof window !== `undefined`;

const API_ENDPOINT = isBrowser ? SITE_CONFIG.SITE.API_ENDPOINT : SITE_CONFIG.SITE.API_ENDPOINT_SSR;

export const ENDPOINT = {
  ACTIVITY: `${API_ENDPOINT}activity-api/api`,
  API: `${API_ENDPOINT}biodiv-api`,
  DATATABLE: `${API_ENDPOINT}dataTable-api/api`,
  DOCUMENT: `${API_ENDPOINT}document-api/api`,
  ESMODULE: `${API_ENDPOINT}esmodule-api/api`,
  FILES: `${API_ENDPOINT}files-api/api`,
  GEOENTITIES: `${API_ENDPOINT}geoentities-api/api`,
  GEOSERVER: `${SITE_CONFIG.SITE.API_ENDPOINT_SSR}geoserver`,
  INTEGRATOR: `${API_ENDPOINT}integrator-api/api`,
  LANDSCAPE: `${API_ENDPOINT}landscape-api/api`,
  NAKSHA: `${API_ENDPOINT}naksha-api/api`,
  OBSERVATION: `${API_ENDPOINT}observation-api/api`,
  PAGES: `${API_ENDPOINT}pages-api/api`,
  RAW: `${API_ENDPOINT}biodiv`,
  RESOURCES: `${API_ENDPOINT}resources-api/api`,
  SPECIES: `${API_ENDPOINT}species-api/api`,
  TAXONOMY: `${API_ENDPOINT}taxonomy-api/api`,
  TRAITS: `${API_ENDPOINT}traits-api/api`,
  USER: `${API_ENDPOINT}user-api/api`,
  USERGROUP: `${API_ENDPOINT}userGroup-api/api`,
  UTILITY: `${API_ENDPOINT}utility-api/api`
};

export const DEFAULT_GROUP: UserGroupIbpExtended = {
  id: null as any,
  icon: `${ENDPOINT.FILES}${SITE_CONFIG.SITE.ICON}`,
  name: SITE_CONFIG.SITE.TITLE[SITE_CONFIG.LANG.DEFAULT],
  nameLocal: SITE_CONFIG.SITE?.TITLE_LOCAL,
  webAddress: SITE_CONFIG.SITE.URL
};

export const DATE_ACCURACY = {
  ACCURATE: "ACCURATE",
  UNKNOWN: "UNKNOWN"
};

export const TOKEN = {
  BATOKEN: "BAToken",
  BRTOKEN: "BRToken",
  ACCESS: "access_token",
  REFRESH: "refresh_token",
  TIMEOUT: "timeout",
  TYPE: "Bearer "
};

export const TRAIT_TYPES = {
  MULTIPLE_CATEGORICAL: "MULTIPLE_CATEGORICAL",
  RANGE: "RANGE",
  SINGLE_CATEGORICAL: "SINGLE_CATEGORICAL"
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
  APPLE_TOUCH: "?h=180&w=180&crop=fit&preserve=true",
  DEFAULT: "?h=200",
  LIST_THUMBNAIL: "?h=300",
  MANIFEST: "${icon}?h=${size}&w=${size}&crop=fit&preserve=true",
  PREVIEW: "?h=500",
  RECENT_THUMBNAIL: "?h=135",
  THUMBNAIL: "?h=34",
  TWITTER: "?w=600&h=330&fit=center&preserve=true"
};

export const FORWARD_BLACKLIST = ["login", "register"];

export const RESOURCE_TYPE = {
  DOCUMENT: "document",
  OBSERVATION: "observation",
  SPECIES: "species",
  DATATABLE: "datatable"
};

export const APP_VERSION = packageJson.version;
