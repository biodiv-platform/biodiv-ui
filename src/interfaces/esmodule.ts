export interface AggregationResponse {
  groupAggregation?: {
    [name: string]: number; // int64
  };
}
export interface CommonName {
  three_letter_code?: string;
  name?: string;
  language_name?: string;
  id?: number; // int32
  language_id?: number; // int32
}
export interface CustomFieldValues {
  value?: string;
  valueIcon?: string;
}
export interface CustomFields {
  id?: number; // int64
  name?: string;
  fieldtype?: string;
  dataType?: string;
  values?: CustomFieldValues[];
}
export interface ElasticIndexes {}
export interface ExtendedTaxonDefinition {
  parent_taxon_definition_id?: number; // int32
  group_name?: string;
  accepted_ids?: number /* int32 */[];
  hierarchy?: string;
  italicised_form?: string;
  species_id?: number; // int32
  species_title?: string;
  path?: string;
  repr_image_id?: string;
  repr_image_url?: string;
  group_id?: number; // float
  name?: string;
  common_names?: CommonName[];
  rank?: number; // int32
  id?: number; // int32
  position?: string;
  lowercase_match_name?: string;
  canonical_form?: string;
  status?: string;
  accepted_names?: string[];
}
export interface Feature {
  type?: string;
  geometry?: Geometry;
  properties?: {
    [name: string]: Record<string, unknown>;
  };
}
export interface FilterPanelData {
  speciesGroup?: SpeciesGroup[];
  userGroup?: UserGroup[];
  states?: string[];
  traits?: Traits[];
  customFields?: CustomFields[];
}
export interface GeoHashAggregationData {
  geoHashData?: {
    [name: string]: number; // int64
  };
  totalCount?: number; // int64
}
export interface Geojson {
  type?: string;
  features?: Feature[];
}
export interface GeojsonData {
  geojson?: Geojson;
  max_count?: number; // int64
  min_count?: number; // int64
}
export interface Geometry {
  type?: string;
  coordinates?: number /* double */[][][];
}
export interface MapAndBoolQuery {
  key?: string;
  path?: string;
  values?: Record<string, unknown>[];
}
export interface MapAndMatchPhraseQuery {
  key?: string;
  path?: string;
  value?: Record<string, unknown>;
}
export interface MapAndRangeQuery {
  key?: string;
  path?: string;
  start?: Record<string, unknown>;
  end?: Record<string, unknown>;
}
export interface MapBoolQuery {
  key?: string;
  path?: string;
  values?: Record<string, unknown>[];
}
export interface MapBoundParams {
  bounds?: MapBounds;
  polygon?: MapGeoPoint[];
}
export interface MapBounds {
  top?: number; // double
  left?: number; // double
  bottom?: number; // double
  right?: number; // double
}
export interface MapDocument {
  document?: Record<string, unknown>;
}
export interface MapExistQuery {
  key?: string;
  path?: string;
  exists?: boolean;
}
export interface MapGeoPoint {
  lat?: number; // double
  lon?: number; // double
}
export interface MapOrBoolQuery {
  key?: string;
  path?: string;
  values?: Record<string, unknown>[];
}
export interface MapOrMatchPhraseQuery {
  key?: string;
  path?: string;
  value?: Record<string, unknown>;
}
export interface MapOrRangeQuery {
  key?: string;
  path?: string;
  start?: Record<string, unknown>;
  end?: Record<string, unknown>;
}
export interface MapQueryResponse {
  result?:
    | "CREATED"
    | "UPDATED"
    | "DELETED"
    | "NOT_FOUND"
    | "NOOP"
    | "JSON_EXCEPTION"
    | "NO_ID"
    | "UNKNOWN"
    | "ERROR";
  message?: string;
}
export interface MapRangeQuery {
  key?: string;
  path?: string;
  start?: Record<string, unknown>;
  end?: Record<string, unknown>;
}
export interface MapResponse {
  documents?: MapDocument[];
  totalDocuments?: number; // int64
  geohashAggregation?: string;
  viewFilteredGeohashAggregation?: string;
  termsAggregation?: string;
}
export interface MapSearchParams {
  from?: number; // int32
  limit?: number; // int32
  sortOn?: string;
  sortType?: "ASC" | "DESC";
  mapBoundParams?: MapBoundParams;
}
export interface MapSearchQuery {
  andBoolQueries?: MapAndBoolQuery[];
  orBoolQueries?: MapOrBoolQuery[];
  andRangeQueries?: MapAndRangeQuery[];
  orRangeQueries?: MapOrRangeQuery[];
  andExistQueries?: MapExistQuery[];
  andMatchPhraseQueries?: MapAndMatchPhraseQuery[];
  orMatchPhraseQueries?: MapOrMatchPhraseQuery[];
  searchParams?: MapSearchParams;
}
export interface ObservationInfo {
  monthAggregation?: {
    [name: string]: number; // int64
  };
  similarObservation?: SimilarObservation[];
  latlon?: ObservationMapInfo[];
}
export interface ObservationLatLon {
  observationId?: number; // int64
  latitude?: number; // double
  longitude?: number; // double
}
export interface ObservationMapInfo {
  id?: number; // int64
  name?: string;
  latitude?: number; // double
  longitude?: number; // double
}
export interface ObservationNearBy {
  observationId?: number; // int64
  name?: string;
  thumbnail?: string;
  distance?: number; // double
  speciesGroupName?: string;
}
export interface SimilarObservation {
  observationId?: number; // int64
  name?: string;
  reprImage?: string;
}
export interface SpeciesGroup {
  id?: number; // int64
  name?: string;
}
export interface TraitValue {
  value?: string;
  valueIcon?: string;
}
export interface Traits {
  id?: number; // int64
  name?: string;
  type?: string;
  traitValues?: TraitValue[];
}
export interface UserGroup {
  id?: number; // int64
  name?: string;
  webAddress?: string;
}
export interface UserScore {
  record?: {
    [name: string]: {
      [name: string]: string;
    };
  }[];
}
