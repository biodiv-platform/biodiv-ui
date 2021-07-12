export interface BodyPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface BreadCrumb {
  id?: number; // int64
  name?: string;
  rankName?: string;
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
export interface ContentDisposition {
  type?: string;
  parameters?: {
    [name: string]: string;
  };
  fileName?: string;
  creationDate?: string; // date-time
  modificationDate?: string; // date-time
  readDate?: string; // date-time
  size?: number; // int64
}
export interface EncryptedKey {
  token?: string;
}
export interface FileMetadata {
  fileType?: string;
  nameToRank?: {
    [name: string]: string;
  };
  scientificColumnName?: string;
  synonymColumnName?: string;
  rankColumnName?: string;
  statusColumnName?: string;
  positionColumnName?: string;
  sourceColumnName?: string;
  sourceIdColumnName?: string;
  commonNameTagType?: "name" | "threeLetterCode" | "twoLetterCode";
  commonNameColumn?: string;
}
export interface FormDataBodyPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  formDataContentDisposition?: FormDataContentDisposition;
  simple?: boolean;
  name?: string;
  value?: string;
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface FormDataContentDisposition {
  type?: string;
  parameters?: {
    [name: string]: string;
  };
  fileName?: string;
  creationDate?: string; // date-time
  modificationDate?: string; // date-time
  readDate?: string; // date-time
  size?: number; // int64
  name?: string;
}
export interface FormDataMultiPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  bodyParts?: BodyPart[];
  fields?: {
    [name: string]: FormDataBodyPart[];
  };
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface Language {
  id?: number; // int64
  name?: string;
  threeLetterCode?: string;
  isDirty?: boolean;
  region?: string;
}
export interface MediaType {
  type?: string;
  subtype?: string;
  parameters?: {
    [name: string]: string;
  };
  wildcardType?: boolean;
  wildcardSubtype?: boolean;
}
export interface MessageBodyWorkers {}
export interface MultiPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  bodyParts?: BodyPart[];
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface ParameterizedHeader {
  value?: string;
  parameters?: {
    [name: string]: string;
  };
}
export interface PermissionData {
  taxonId?: number; // int64
  userId?: number; // int64
  role?: string;
}
export interface Providers {}
export interface SpeciesGroup {
  id?: number; // int64
  name?: string;
  parentGroupId?: number; // int64
  groupOrder?: number; // int32
}
export interface SpeciesGroupMapping {
  id?: number; // int64
  speciesGroupId?: number; // int64
  taxonConceptId?: number; // int64
}
export interface SpeciesPermission {
  id?: number; // int64
  version?: number; // int64
  authorId?: number; // int64
  createdOn?: string; // date-time
  permissionType?: string;
  taxonConceptId?: number; // int64
}
export interface SynonymData {
  id?: number; // int64
  name?: string;
  rank?: string;
  dataSource?: string;
  dataSourceId?: string;
}
export interface TaxonRelation {
  taxonid?: number; // int64
  id?: number; // int64
  text?: string;
  rank?: string;
  path?: string;
  classification?: number; // int64
  parent?: number; // int64
  position?: string;
  speciesId?: number; // int64
  ids?: string[];
  children?: TaxonRelation[];
}
export interface TaxonTree {
  taxonId?: number; // int64
  taxonList?: number /* int64 */[];
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
export interface TaxonomyNameListResponse {
  count?: number; // int32
  taxonomyNameListItems?: TaxonomyNamelistItem[];
}
export interface TaxonomyNamelistItem {
  id?: number; // int64
  rank?: string;
  name?: string;
  status?: string;
  position?: string;
  rankValue?: number; // double
}
export interface TaxonomyRegistryResponse {
  id?: string;
  rank?: string;
  name?: string;
  canonicalForm?: string;
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
  acceptedId?: number; // int64
  rankToName?: {
    [name: string]: string;
  };
}
export interface TaxonomySearch {
  matched?: TaxonomyDefinitionAndRegistry[];
  parentMatched?: TaxonomyDefinitionAndRegistry[];
}
export interface TaxonomyStatusUpdate {
  taxonId?: number; // int64
  status?: "ACCEPTED" | "SYNONYM";
  newTaxonId?: number; // int64
  hierarchy?: {
    [name: string]: string;
  };
}
