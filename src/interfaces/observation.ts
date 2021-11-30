export interface Activity {
  id?: number; // int64
  version?: number; // int64
  activityDescription?: string;
  activityHolderId?: number; // int64
  activityHolderType?: string;
  activityRootType?: string;
  activityType?: string;
  authorId?: number; // int64
  dateCreated?: string; // date-time
  lastUpdated?: string; // date-time
  rootHolderId?: number; // int64
  rootHolderType?: string;
  subRootHolderId?: number; // int64
  subRootHolderType?: string;
  isShowable?: boolean;
  descriptionJson?: MyJson;
}
export interface AllRecoSugguestions {
  commonName?: string;
  scientificName?: string;
  taxonId?: number; // int64
  speciesId?: number; // int64
  userList?: UserIbp[];
}
export interface BreadCrumb {
  id?: number; // int64
  name?: string;
  rankName?: string;
}
export interface CommentLoggingData {
  body?: string;
  rootHolderId?: number; // int64
  rootHolderType?: string;
  subRootHolderId?: number; // int64
  subRootHolderType?: string;
  mailData?: MailData;
  languageId?: number; // int64
}
export interface Coordinate {
  x?: number; // double
  y?: number; // double
  z?: number; // double
}
export interface CoordinateSequence {
  dimension?: number; // int32
}
export interface CoordinateSequenceFactory {}
export interface CustomFieldData {
  cfId?: number; // int64
  cfName?: string;
  dataType?: string;
  fieldType?: string;
  cfIconUrl?: string;
  cfNotes?: string;
  defaultValue?: string;
  units?: string;
  displayOrder?: number; // int32
  allowedParticipation?: boolean;
  customFieldValues?: CustomFieldValuesData;
}
export interface CustomFieldDetails {
  customFields?: CustomFields;
  cfValues?: CustomFieldValues[];
  defaultValue?: string;
  displayOrder?: number; // int32
  isMandatory?: boolean;
  allowedParticipation?: boolean;
}
export interface CustomFieldFactsInsert {
  userGroupId?: number; // int64
  customFieldId?: number; // int64
  observationId?: number; // int64
  singleCategorical?: number; // int64
  multipleCategorical?: number /* int64 */[];
  minValue?: string;
  maxValue?: string;
  textBoxValue?: string;
}
export interface CustomFieldObservationData {
  userGroupId?: number; // int64
  customField?: CustomFieldData[];
}
export interface CustomFieldPermission {
  userGroupId?: number; // int64
  allowedCfId?: number /* int64 */[];
}
export interface CustomFieldValues {
  id?: number; // int64
  customFieldId?: number; // int64
  values?: string;
  iconURL?: string;
  notes?: string;
}
export interface CustomFieldValuesData {
  fieldTextData?: string;
  singleCategoricalData?: CustomFieldValues;
  multipleCategoricalData?: CustomFieldValues[];
  minRange?: string;
  maxRange?: string;
}
export interface CustomFields {
  id?: number; // int64
  authorId?: number; // int64
  name?: string;
  dataType?: string;
  fieldType?: string;
  units?: string;
  iconURL?: string;
  notes?: string;
}
export interface DataTableWkt {
  id?: number; // int64
  title?: string;
  createdOn?: string; // date-time
  description?: string;
  summary?: string;
  partyAttributions?: string;
  isDeleted?: boolean;
  lastRevised?: string; // date-time
  taxonomicCoverageGroupIds?: string;
  basisOfData?: string;
  uploaderId?: number; // int64
  dataTableType?: string;
  datasetId?: number; // int64
  geographicalCoverageGeoPrivacy?: boolean;
  geographicalCoverageLatitude?: number; // double
  geographicalCoverageLongitude?: number; // double
  geographicalCoverageTopology?: string;
  geographicalCoveragePlaceName?: string;
  geographicalCoverageLocationScale?: string;
  project?: string;
  methods?: string;
  temporalCoverageDateAccuracy?: string;
  temporalCoverageFromDate?: string; // date-time
  basisOfRecord?: string;
  isVerified?: boolean;
  fieldMapping?: string;
  ufileId?: number; // int64
}
export interface DocumentMailData {
  documentId?: number; // int64
  createdOn?: string; // date-time
  authorId?: number; // int64
}
export interface DownloadLog {
  id?: number; // int64
  version?: number; // int64
  authorId?: number; // int64
  createdOn?: string; // date-time
  filePath?: string;
  filterUrl?: string;
  notes?: string;
  paramsMapAsText?: string;
  status?: string;
  type?: string;
  sourceType?: string;
  offsetParam?: number; // int64
}
export interface Envelope {
  area?: number; // double
  maxX?: number; // double
  maxY?: number; // double
  height?: number; // double
  width?: number; // double
  minX?: number; // double
  minY?: number; // double
  null?: boolean;
}
export interface FactValuePair {
  nameId?: number; // int64
  name?: string;
  valueId?: number; // int64
  value?: string;
  fromDate?: string; // date-time
  toDate?: string; // date-time
  type?: string;
  isParticipatry?: boolean;
}
export interface FactsUpdateData {
  mailData?: MailData;
  traitValueList?: number /* int64 */[];
  valuesString?: string[];
  pageTaxonId?: number; // int64
}
export interface Featured {
  id?: number; // int64
  version?: number; // int64
  authorId?: number; // int64
  createdOn?: string; // date-time
  notes?: string;
  objectId?: number; // int64
  objectType?: string;
  userGroup?: number; // int64
  languageId?: number; // int64
  expireTime?: string; // date-time
}
export interface FeaturedCreate {
  notes?: string;
  objectId?: number; // int64
  objectType?: string;
  userGroup?: number /* int64 */[];
}
export interface FilterPanelData {
  speciesGroup?: SpeciesGroup[];
  userGroup?: UserGroup[];
  states?: string[];
  traits?: Traits[];
  customFields?: CustomFields[];
}
export interface Flag {
  id?: number; // int64
  version?: number; // int64
  authorId?: number; // int64
  createdOn?: string; // date-time
  flag?: string;
  notes?: string;
  objectId?: number; // int64
  objectType?: string;
}
export interface FlagIbp {
  flag?: string;
  notes?: string;
}
export interface FlagShow {
  flag?: Flag;
  user?: UserIbp;
}
export interface Follow {
  id?: number; // int64
  version?: number; // int64
  objectId?: number; // int64
  objectType?: string;
  authorId?: number; // int64
  createdOn?: string; // date-time
}
export interface Geometry {
  envelope?: Geometry;
  factory?: GeometryFactory;
  userData?: {
    [key: string]: any;
  };
  precisionModel?: PrecisionModel;
  coordinate?: Coordinate;
  coordinates?: Coordinate[];
  numPoints?: number; // int32
  rectangle?: boolean;
  area?: number; // double
  centroid?: Point;
  interiorPoint?: Point;
  boundary?: Geometry;
  boundaryDimension?: number; // int32
  envelopeInternal?: Envelope;
  srid?: number; // int32
  numGeometries?: number; // int32
  geometryType?: string;
  dimension?: number; // int32
  simple?: boolean;
  valid?: boolean;
  length?: number; // double
  empty?: boolean;
}
export interface GeometryFactory {
  precisionModel?: PrecisionModel;
  coordinateSequenceFactory?: CoordinateSequenceFactory;
  srid?: number; // int32
}
export interface Language {
  id?: number; // int64
  name?: string;
  threeLetterCode?: string;
  isDirty?: boolean;
  region?: string;
}
export interface License {
  id?: number; // int64
  name?: string;
  url?: string;
}
export interface ListPagePermissions {
  validatePermissionTaxon?: number /* int64 */[];
  cfPermission?: CustomFieldPermission[];
}
export interface MailData {
  observationData?: ObservationMailData;
  documentMailData?: DocumentMailData;
  userGroupData?: UserGroupMailData[];
  speciesData?: SpeciesMailData;
}
export interface MapAggregationResponse {
  groupSpeciesName?: {
    [name: string]: number; // int64
  };
  geoEntity?: {
    [name: string]: number; // int64
  };

  groupStatus?: {
    [name: string]: number; // int64
  };
  groupTaxonIDExists?: {
    [name: string]: number; // int64
  };
  groupUserGroupName?: {
    [name: string]: number; // int64
  };
  groupIdentificationNameExists?: {
    [name: string]: number; // int64
  };
  groupFlag?: {
    [name: string]: number; // int64
  };
  groupValidate?: {
    [name: string]: number; // int64
  };
  groupAudio?: number; // int64
  groupVideo?: number; // int64
  groupImages?: number; // int64
  groupNoMedia?: number; // int64
  groupMonth?: {
    [name: string]: number; // int64
  };
  groupTraits?: {
    [name: string]: {
      [name: string]: number; // int64
    };
  };
  groupState?: {
    [name: string]: number; // int64
  };
  groupRank?: {
    [name: string]: number; // int64
  };
  groupCustomField?: {
    [name: string]: {
      [name: string]: number; // int64
    };
  };
}
export interface MapAggregationStatsResponse {
  groupUniqueSpecies?: {
    [name: string]: number; // int64
  };
  groupTopUploaders?: TopUploadersInfo[];
  groupTopIdentifiers?: TopUploadersInfo[];
  totalCounts?: {
    [name: string]: number; // int64
  };
}
export interface MaxVotedRecoPermission {
  observationId?: number; // int64
  permission?: boolean;
}
export interface MyJson {
  aid?: number; // int64
  name?: string;
  ro_id?: number; // int64
  ro_type?: string;
  description?: string;
  is_migrated?: string;
  activity_performed?: string;
  is_scientific_name?: boolean;
}
export interface Observation {
  id?: number; // int64
  version?: number; // int64
  authorId?: number; // int64
  createdOn?: string; // date-time
  groupId?: number; // int64
  latitude?: number; // double
  longitude?: number; // double
  notes?: string;
  fromDate?: string; // date-time
  placeName?: string;
  rating?: number; // int32
  reverseGeocodedName?: string;
  flagCount?: number; // int32
  geoPrivacy?: boolean;
  habitatId?: number; // int64
  isDeleted?: boolean;
  lastRevised?: string; // date-time
  locationAccuracy?: string;
  visitCount?: number; // int64
  searchText?: string;
  maxVotedRecoId?: number; // int64
  agreeTerms?: boolean;
  isChecklist?: boolean;
  isShowable?: boolean;
  sourceId?: number; // int64
  toDate?: string; // date-time
  topology?: Geometry;
  checklistAnnotations?: string;
  featureCount?: number; // int32
  isLocked?: boolean;
  licenseId?: number; // int64
  languageId?: number; // int64
  locationScale?: string;
  accessRights?: string;
  catalogNumber?: string;
  datasetId?: number; // int64
  externalDatasetKey?: string;
  externalId?: string;
  externalUrl?: string;
  informationWithheld?: string;
  lastCrawled?: string; // date-time
  lastInterpreted?: string; // date-time
  originalAuthor?: string;
  publishingCountry?: string;
  reprImageId?: number; // int64
  viaCode?: string;
  viaId?: string;
  protocol?: string;
  basisOfRecord?: string;
  noOfImages?: number; // int32
  noOfVideos?: number; // int32
  noOfAudio?: number; // int32
  noOfIdentifications?: number; // int32
  dataTableId?: number; // int64
  dateAccuracy?: string;
  isVerified?: boolean;
}
export interface ObservationBulkDTO {
  title?: string;
  summary?: string;
  description?: string;
  createdOn?: string; // date-time
  licenseId?: number; // int64
  contributors?: number; // int64
  attribution?: string;
  dateAccuracy?: string;
  observedFromDate?: string; // date-time
  observedToDate?: string; // date-time
  locationScale?: string;
  locationAccuracy?: string;
  observedAt?: string;
  reverseGeocoded?: string;
  wktString?: string;
  latitude?: number; // double
  longitude?: number; // double
  useDegMinSec?: boolean;
  degMinSec?: string;
  hidePreciseLocation?: boolean;
  project?: string;
  methods?: string;
  basisOfData?: string;
  basisOfRecord?: string;
  isVerified?: boolean;
  dataset?: number; // int64
  filename?: string;
  languageId?: number; // int64
  columns?: {
    [name: string]: number; // int32
  };
  checklistAnnotation?: {
    [name: string]: number; // int32
  };
  sgroup?: string;
}
export interface ObservationCreate {
  getsGroup?: number; // int64
  helpIdentify?: boolean;
  createdOn?: string; // date-time
  fromDate?: string; // date-time
  toDate?: string; // date-time
  recoData?: RecoData;
  dateAccuracy?: string;
  observedOn?: string; // date-time
  protocol?: string;
  basisOfRecords?: string;
  obsvLanguageId?: number; // int64
  observedAt?: string;
  reverseGeocoded?: string;
  locationScale?: string;
  latitude?: number; // double
  longitude?: number; // double
  useDegMinSec?: boolean;
  degMinSec?: string;
  hidePreciseLocation?: boolean;
  factValuePairs?: {
    [name: string]: number /* int64 */[];
  };
  factValueStringPairs?: {
    [name: string]: string[];
  };
  notes?: string;
  tags?: Tags[];
  userGroupId?: number /* int64 */[];
  resources?: ResourceDataObs[];
}
export interface ObservationCreateUGContext {
  observationData?: ObservationCreate;
  customFieldData?: CustomFieldFactsInsert[];
}
export interface ObservationDataTableShow {
  id?: number; // int64
  scientificName?: string;
  commonName?: string;
  getsGroup?: number; // int64
  fromDate?: string;
  observedAt?: string;
  locationScale?: string;
  longitude?: number; // double
  latitude?: number; // double
  dateAccuracy?: string;
  notes?: string;
  geoPrivacy?: boolean;
  checklistAnnotation?: {
    [name: string]: {
      [key: string]: any;
    };
  };
  userInfo?: UserIbp;
}
export interface ObservationHomePage {
  resourceUrl?: string;
  observation?: ObservationListMinimalData;
}
export interface ObservationInfo {
  monthAggregation?: {
    [name: string]: number; // int64
  };
  similarObservation?: SimilarObservation[];
  latlon?: ObservationMapInfo[];
}
export interface ObservationListData {
  observationList?: ObservationListPageMapper[];
  totalCount?: number; // int64
  geohashAggregation?: {
    [name: string]: number; // int64
  };
  aggregationData?: MapAggregationResponse;
  aggregateStatsData?: MapAggregationStatsResponse;
  observationListMinimal?: ObservationListMinimalData[];
}
export interface ObservationListMinimalData {
  observationId?: number; // int64
  speciesGroupId?: number; // int64
  speciesGroup?: string;
  thumbnail?: string;
  recoIbp?: RecoIbp;
  user?: UserIbp;
}
export interface ObservationListPageMapper {
  observationId?: number; // int64
  createdOn?: string; // date-time
  lastRevised?: string; // date-time
  observedOn?: string; // date-time
  reverseGeocodedName?: string;
  speciesGroupId?: number; // int64
  speciesGroup?: string;
  noOfImages?: number; // int64
  noOfAudios?: number; // int64
  noOfVideos?: number; // int64
  placeName?: string;
  reprImageUrl?: string;
  user?: UserIbp;
  factValuePair?: FactValuePair[];
  flagShow?: FlagShow[];
  recoShow?: RecoShow;
  userGroup?: UserGroupIbp[];
  customField?: CustomFieldObservationData[];
  tags?: Tags[];
}
export interface ObservationLocationInfo {
  soil?: string;
  temp?: string;
  rainfall?: string;
  tahsil?: string;
  forestType?: string;
  district?: string;
  province?: string;
  protectedAreaName?: string;
}
export interface ObservationMailData {
  observationId?: number; // int64
  location?: string;
  observedOn?: string; // date-time
  iconURl?: string;
  scientificName?: string;
  commonName?: string;
  authorId?: number; // int64
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
export interface ObservationUGContextCreatePageData {
  userGroupSGroup?: UserGroupSpeciesGroup[];
  customField?: CustomFieldDetails[];
}
export interface ObservationUpdateData {
  resources?: ResourceDataObs[];
  notes?: string;
  checklistAnnotations?: string;
  dateAccuracy?: string;
  observedOn?: string; // date-time
  observedAt?: string;
  reverseGeocoded?: string;
  locationScale?: string;
  latitude?: number; // double
  longitude?: number; // double
  dataTableId?: number;
  hidePreciseLocation?: boolean;
}
export interface ObservationUserPageInfo {
  uniqueSpeciesInfos?: UniqueSpeciesInfo[];
  totalCount?: number; // int64
}
export interface ObservationUserPermission {
  validatePermissionTaxon?: number /* int64 */[];
  userGroupMember?: UserGroupIbp[];
  userGroupFeature?: UserGroupIbp[];
  cfPermission?: CustomFieldPermission[];
  following?: boolean;
}
export interface Point {
  envelope?: Geometry;
  factory?: GeometryFactory;
  userData?: {
    [key: string]: any;
  };
  coordinates?: Coordinate[];
  coordinateSequence?: CoordinateSequence;
  coordinate?: Coordinate;
  numPoints?: number; // int32
  boundary?: Geometry;
  boundaryDimension?: number; // int32
  geometryType?: string;
  dimension?: number; // int32
  y?: number; // double
  x?: number; // double
  simple?: boolean;
  empty?: boolean;
  precisionModel?: PrecisionModel;
  rectangle?: boolean;
  area?: number; // double
  centroid?: Point;
  interiorPoint?: Point;
  envelopeInternal?: Envelope;
  srid?: number; // int32
  numGeometries?: number; // int32
  valid?: boolean;
  length?: number; // double
}
export interface PrecisionModel {
  scale?: number; // double
  offsetY?: number; // double
  maximumSignificantDigits?: number; // int32
  offsetX?: number; // double
  floating?: boolean;
  type?: Type;
}
export interface PublicationGrade {
  hasMediaEvidence?: boolean;
  hasDateDefined?: boolean;
  isLocationDefined?: boolean;
  isIdValidated?: boolean;
  hasTaxonName?: boolean;
  hasfamilyRankOrLower?: boolean;
  isNotFlagged?: boolean;
  isNativeObservation?: boolean;
}
export interface RecoData {
  taxonCommonName?: string;
  scientificNameTaxonId?: number; // int64
  taxonScientificName?: string;
  recoComment?: string;
  confidence?: string;
  languageId?: number; // int64
}
export interface RecoIbp {
  commonName?: string;
  scientificName?: string;
  taxonId?: number; // int64
  speciesId?: number; // int64
  breadCrumbs?: BreadCrumb[];
  recoVoteCount?: number; // int32
  status?: string;
  userIbp?: UserIbp;
}
export interface RecoSet {
  taxonId?: number; // int64
  commonName?: string;
  scientificName?: string;
}
export interface RecoShow {
  recoIbp?: RecoIbp;
  allRecoVotes?: AllRecoSugguestions[];
  isLocked?: boolean;
}
export interface Resource {
  id?: number; // int64
  version?: number; // int64
  description?: string;
  fileName?: string;
  mimeType?: string;
  type?: string;
  url?: string;
  rating?: number; // int32
  uploadTime?: string; // date-time
  uploaderId?: number; // int64
  context?: string;
  languageId?: number; // int64
  accessRights?: string;
  annotations?: string;
  gbifId?: number; // int64
  licenseId?: number; // int64
}
export interface ResourceData {
  resource?: Resource;
  userIbp?: UserIbp;
  license?: License;
}
export interface ResourceDataObs {
  path?: string;
  url?: string;
  type?: string;
  caption?: string;
  rating?: number; // int32
  licenseId?: number; // int64
  context?: string;
}
export interface ResourceRating {
  resourceId?: number; // int64
  rating?: number; // int32
}
export interface ShowData {
  observation?: Observation;
  factValuePair?: FactValuePair[];
  observationResource?: ResourceData[];
  userGroups?: UserGroupIbp[];
  customField?: CustomFieldObservationData[];
  layerInfo?: ObservationLocationInfo;
  esLayerInfo?: ObservationInfo;
  recoIbp?: RecoIbp;
  flag?: FlagShow[];
  tags?: Tags[];
  fetaured?: Featured[];
  authorInfo?: UserIbp;
  authorScore?: {
    [name: string]: string;
  };
  allRecoVotes?: AllRecoSugguestions[];
  observationNearBy?: ObservationNearBy[];
  dataTable?: DataTableWkt;
  checkListAnnotation?: {
    [name: string]: {
      [key: string]: any;
    };
  };
  activityCount?: number; // int32
}
export interface ShowObervationDataTable {
  datatable?: DataTableWkt;
  userGroups?: UserGroupIbp[];
  layerInfo?: ObservationLocationInfo;
  authorInfo?: UserIbp;
  authorScore?: {
    [name: string]: string;
  };
  observationList?: ObservationDataTableShow[];
}
export interface SimilarObservation {
  observationId?: number; // int64
  name?: string;
  reprImage?: string;
}
export interface SpeciesGroup {
  id?: number; // int64
  name?: string;
  parentGroupId?: number; // int64
  groupOrder?: number; // int32
}
export interface SpeciesMailData {
  speciesId?: number; // int64
  speciesName?: string;
  iconUrl?: string;
  authorId?: number; // int64
}
export interface Tags {
  id?: number; // int64
  version?: number; // int64
  name?: string;
}
export interface TagsMapping {
  objectId?: number; // int64
  tags?: Tags[];
}
export interface TopUploadersInfo {
  name?: string;
  pic?: string;
  authorId?: number; // int64
  count?: number; // int64
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
export interface TraitsValue {
  id?: number; // int64
  value?: string;
  icon?: string;
  traitInstanceId?: number; // int64
  isDeleted?: boolean;
}
export interface TraitsValuePair {
  traits?: Traits;
  values?: TraitsValue[];
}
export interface Type {}
export interface UniqueSpeciesInfo {
  name?: string;
  maxVotedRecoId?: number; // int64
  speciesId?: number; // int64
  taxonId?: number; // int64
  freq?: number; // int64
}
export interface UserGroup {
  id?: number; // int64
  name?: string;
  webAddress?: string;
}
export interface UserGroupIbp {
  id?: number; // int64
  name?: string;
  icon?: string;
  webAddress?: string;
  isParticipatory?: boolean;
}
export interface UserGroupMailData {
  id?: number; // int64
  name?: string;
  icon?: string;
  webAddress?: string;
}
export interface UserGroupSpeciesGroup {
  userGroupId?: number; // int64
  speciesGroupId?: number; // int64
}
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
