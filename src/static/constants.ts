import SITE_CONFIG from "@configs/site-config";
import { UserGroupIbpExtended } from "@interfaces/custom";

import packageJson from "../../package.json";

export const isBrowser = typeof window !== `undefined`;

const API_ENDPOINT = isBrowser ? SITE_CONFIG.SITE.API_ENDPOINT : SITE_CONFIG.SITE.API_ENDPOINT_SSR;

export const ENDPOINT = {
  ACTIVITY: `${API_ENDPOINT}activity-api/api`,
  API: `${SITE_CONFIG.SITE.URL}/api`,
  CURATE: `${API_ENDPOINT}curate-api`,
  DATATABLE: `${API_ENDPOINT}dataTable-api/api`,
  DOCUMENT: `${API_ENDPOINT}document-api/api`,
  ESMODULE: `${API_ENDPOINT}esmodule-api/api`,
  FILES: `${SITE_CONFIG.SITE.API_ENDPOINT}files-api/api`,
  GEOENTITIES: `${API_ENDPOINT}geoentities-api/api`,
  GEOSERVER: `${SITE_CONFIG.GEOSERVER_BASE_PATH}/geoserver`,
  INTEGRATOR: `${API_ENDPOINT}integrator-api/api`,
  LANDSCAPE: `${API_ENDPOINT}landscape-api/api`,
  NAKSHA: `${API_ENDPOINT}naksha-integrator-api/api`,
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
  SYNONYM: "purple",
  PREDICTION: "cyan"
};

export const PAGINATION_LIMIT = 3;

export const RESOURCE_SIZE = {
  APPLE_TOUCH: "?h=180&w=180&crop=fit&preserve=true",
  DEFAULT: "?h=200",
  LIST_THUMBNAIL: "?h=300",
  MANIFEST: "${icon}?h=${size}&w=${size}&crop=fit&preserve=true",
  PREVIEW: "?h=500",
  RECENT_THUMBNAIL: "?h=230",
  THUMBNAIL: "?h=34",
  TWITTER: "?w=600&h=330&fit=center&preserve=true",
  PAGE: "?w=1440&h=300&fit=center"
};

export const FORWARD_BLACKLIST = ["login", "register"];

export const RESOURCE_TYPE = {
  DATATABLE: "datatable",
  DOCUMENT: "document",
  OBSERVATION: "observation",
  SPECIES: "species",
  TAXONOMY: "taxonomy",
  PAGE: "page"
};

export const APP_VERSION = packageJson.version;

export const MENU_PORTAL_TARGET = isBrowser ? document.body : undefined;

export const LEAFLET_MARKER_ICON: any = {
  iconRetinaUrl: "/next-assets/marker-default@2x.png",
  iconUrl: "/next-assets/marker-default.png",
  iconSize: [30, 70],
  shadowSize: [0, 0],
  shadowAnchor: [0, 0],
  popupAnchor: [3, -40]
};

export const CROP_STATUS = {
  NOT_CURATED: "NOT_CURATED",
  SELECTED: "SELECTED",
  REJECTED: "REJECTED",
  OBSERVATION_NULL_MESSAGE: "Observation ID is null"
};

export const plantnetText = "Pl@ntNet";
export const specRecText = "SpecRec";

export const INVALID_COORDINATE = {
  LATITUDE: 91,
  LONGITUDE: 361
};

export const MEDIA_TOGGLE = {
  WITH_MEDIA: "withMedia",
  ALL: "All"
};

export const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const WeekDays = ["Sat", "Fri", "Thu", "Wed", "Tue", "Mon", "Sun"];

export const PREVENT_CLICK_TAGS = ["INPUT", "LABEL", "BUTTON"];

export const REQUIRED_COLUMNS = ["ScientificName", "TaxonConceptId", "SpeciesId", "Contributor"];

export const CATEGORY_TYPE = [
  { label: "All", value: "All" },
  { label: "Observation Traits", value: "Observation" },
  { label: "Species Traits", value: "Species" }
];

export const ACTIONS = {
  SELECTALL: "selectAll",
  UNSELECTALL: "unSelectAll",
  NEXTPAGESELECT: "nextPageSelect"
};

export const STATS_FILTER = {
  TAXON: "taxon",
  COUNT_PER_DAY: "countPerDay",
  OBSERVED_ON: "observedOn",
  IDENTIFIERS: "identifiers",
  UPLOADERS: "uploaders",
  TOTALS: "totals",
  TRAITS: "traits",
  LIFELIST: "lifelist"
};
