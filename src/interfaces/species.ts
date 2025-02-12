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
}
export interface CommonName {
  id?: number; // int64
  languageId?: number; // int64
  name?: string;
  taxonConceptId?: number; // int64
  uploadTime?: string; // date-time
  uploaderId?: number; // int64
  transliteration?: string;
  viaDatasource?: string;
  isDeleted?: boolean;
  language?: Language;
  preffered?: boolean;
}
export interface CommonNamesData {
  id?: number; // int64
  languageId?: number; // int64
  name?: string;
  taxonConceptId?: number; // int64
}
export interface DocumentMailData {
  documentId?: number; // int64
  createdOn?: string; // date-time
  authorId?: number; // int64
}
export interface DocumentMeta {
  id?: number; // int64
  title?: string;
  desc?: string;
  author?: UserIbp;
  createdOnDate?: string; // date-time
  displayOrder?: number; // int32
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
export interface FieldDisplay {
  parentField?: FieldNew;
  childFields?: FieldNew[];
}
export interface FieldNew {
  id?: number; // int64
  parentId?: number; // int64
  displayOrder?: number; // int64
  label?: string;
  header?: string;
}
export interface FieldRender {
  parentField?: FieldNew;
  childField?: FieldDisplay[];
}
export interface Follow {
  id?: number; // int64
  version?: number; // int64
  objectId?: number; // int64
  objectType?: string;
  authorId?: number; // int64
  createdOn?: string; // date-time
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
export interface MailData {
  observationData?: ObservationMailData;
  documentMailData?: DocumentMailData;
  userGroupData?: UserGroupMailData[];
  speciesData?: SpeciesMailData;
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
export interface ObservationMailData {
  observationId?: number; // int64
  location?: string;
  observedOn?: string; // date-time
  iconURl?: string;
  scientificName?: string;
  commonName?: string;
  authorId?: number; // int64
}
export interface PermissionData {
  taxonId?: number; // int64
  userId?: number; // int64
  role?: string;
}
export interface Reference {
  id: number | string;
  title: string;
  url?: string | null;
  speciesId?: number | string;
  speciesFieldId?: number | string | null;
  isDeleted: string;
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
export interface ShowSpeciesPage {
  species?: Species;
  prefferedCommonName?: CommonName;
  speciesGroup?: SpeciesGroup;
  breadCrumbs?: BreadCrumb[];
  taxonomyDefinition?: TaxonomyDefinition;
  resourceData?: ResourceData[];
  fieldData?: SpeciesFieldData[];
  facts?: FactValuePair[];
  userGroups?: UserGroupIbp[];
  featured?: Featured[];
  taxonomicNames?: TaxonomicNames;
  temporalData?: {
    [name: string]: number; // int64
  };
  documentMetaList?: DocumentMeta[];
  referencesListing?: Reference[];
}
export interface Species {
  id?: number; // int64
  version?: number; // int64
  percentOfInfo?: number; // int32
  taxonConceptId?: number; // int64
  title?: string;
  dateCreated?: string; // date-time
  lastUpdated?: string; // date-time
  featureCount?: number; // int32
  habitatId?: number; // int64
  hasMedia?: boolean;
  reprImageId?: number; // int64
  isDeleted?: boolean;
  dataTableId?: number; // int64
}
export interface SpeciesCreateData {
  taxonConceptId?: number; // int64
  title?: string;
  habitatId?: number; // int64
}
export interface SpeciesField {
  id?: number; // int64
  version?: number; // int64
  description?: string;
  fieldId?: number; // int64
  speciesId?: number; // int64
  status?: string;
  classes?: string;
  countryId?: number; // int64
  dateCreated?: string; // date-time
  lastUpdated?: string; // date-time
  uploadedTime?: string; // date-time
  uploaderId?: number; // int64
  languageId?: number; // int64
  dataTableId?: number; // int64
  isDeleted?: boolean;
}
export interface SpeciesFieldData {
  id?: number; // int64
  fieldId?: number; // int64
  displayOrder?: number; // int64
  label?: string;
  fieldDescription?: string;
  header?: string;
  fieldData?: SpeciesField;
  references?: Reference[];
  attributions?: string;
  contributor?: UserIbp[];
  audienceType?: string;
  license?: License;
  speciesFieldResource?: ResourceData[];
}
export interface SpeciesFieldUpdateData {
  isEdit?: boolean;
  fieldId?: number; // int64
  speciesFieldId?: number; // int64
  licenseId?: number; // int64
  sfDescription?: string;
  sfStatus?: string;
  attributions?: string;
  speciesFieldResource?: SpeciesResourceData[];
  contributorIds?: number /* int64 */[];
  references?: Reference[];
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
export interface SpeciesPermission {
  isContributor?: boolean;
  isFollower?: boolean;
}
export interface SpeciesPull {
  observationId?: number; // int64
  resourceData?: ResourceData[];
}
export interface SpeciesResourceData {
  path?: string;
  url?: string;
  type?: string;
  caption?: string;
  rating?: number; // int32
  licenseId?: number; // int64
}
export interface SpeciesResourcesPreData {
  path?: string;
  url?: string;
  type?: string;
  caption?: string;
  rating?: number; // int32
  licenseId?: number; // int64
  observationId?: number; // int64
  resourcesId?: number; // int64
}
export interface SpeciesTrait {
  traitsValuePairList?: TraitsValuePair[];
  categoryName?: string;
}
export interface SynonymData {
  id?: number; // int64
  name?: string;
  rank?: string;
  dataSource?: string;
  dataSourceId?: string;
}
export interface TaxonomicNames {
  commonNames?: CommonName[];
  synonyms?: TaxonomyDefinition[];
}
export interface TaxonomyDefinition {
  id?: number; // int64
  binomialForm?: string;
  canonicalForm?: string;
  italicisedForm?: string;
  externalLinksId?: number; // int64
  name?: string;
  normalizedForm?: string;
  rank?: string;
  uploadTime?: string; // date-time
  uploaderId?: number; // int64
  status?: string;
  position?: string;
  authorYear?: string;
  matchDatabaseName?: string;
  matchId?: string;
  ibpSource?: string;
  viaDatasource?: string;
  isFlagged?: boolean;
  relationship?: string;
  classs?: string;
  flaggingReason?: string;
  isDeleted?: boolean;
  dirtyListReason?: string;
  activityDescription?: string;
  defaultHierarchy?: string;
  nameSourceId?: string;
}
export interface TaxonomyDefinitionAndRegistry {
  taxonomyDefinition?: TaxonomyDefinition;
  registry?: TaxonomyRegistryResponse[];
}
export interface TaxonomyRegistryResponse {
  id?: string;
  rank?: string;
  name?: string;
}
export interface TaxonomySave {
  scientificName?: string;
  rank?: string;
  synonyms?: string;
  status?: "ACCEPTED" | "SYNONYM";
  position?: "CLEAN" | "RAW" | "WORKING";
  sourceId?: string;
  source?: string;
  commonNames?: {
    [name: string]: string[];
  };
  rankToName?: {
    [name: string]: string;
  };
}
export interface TaxonomySearch {
  matched?: TaxonomyDefinitionAndRegistry[];
  parentMatched?: TaxonomyDefinitionAndRegistry[];
}
export interface Traits {
  id?: number; // int64
  dataType?: string;
  description?: string;
  fieldId?: number; // int64
  name?: string;
  traitTypes?: string;
  units?: string;
  isNotObservationTraits?: boolean;
  showInObservation?: boolean;
  isParticipatory?: boolean;
  isDeleted?: boolean;
  source?: string;
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
export interface UserGroupSpeciesCreateData {
  userGroupIds?: number /* int64 */[];
}
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
