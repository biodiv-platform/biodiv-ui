import SITE_CONFIG from "@configs/site-config";

export const GEOCODE_OPTIONS = {
  componentRestrictions: { country: SITE_CONFIG.MAP.COUNTRY }
};

export const AUTOCOMPLETE_FIELDS = ["formatted_address", "geometry", "name"];

export const GMAP_LIBRARIES: any = ["drawing", "places"];
