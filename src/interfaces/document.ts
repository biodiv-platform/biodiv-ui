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
export interface BibFieldsData {
  author?: string;
  journal?: string;
  booktitle?: string;
  title?: string;
  year?: string;
  month?: string;
  volume?: string;
  number?: string;
  pages?: string;
  publisher?: string;
  school?: string;
  edition?: string;
  series?: string;
  address?: string;
  chapter?: string;
  note?: string;
  type?: string;
  editor?: string;
  organization?: string;
  howpublished?: string;
  institution?: string;
  doi?: string;
  url?: string;
  language?: string;
  file?: string;
  itemTypeId?: number; // int64
  isbn?: string;
  extra?: string;
  abstract?: string;
  "item type"?: string;
}
export interface BibTexItemType {
  value?: number; // int64
  label?: string;
}
export interface CommentLoggingData {
  body?: string;
  rootHolderId?: number; // int64
  rootHolderType?: string;
  subRootHolderId?: number; // int64
  subRootHolderType?: string;
  mailData?: MailData;
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
export interface Document {
  id?: number; // int64
  version?: number; // int64
  agreeTerms?: boolean;
  attribution?: string;
  authorId?: number; // int64
  contributors?: string;
  coverageId?: number; // int64
  createdOn?: string; // date-time
  notes?: string;
  lastRevised?: string; // date-time
  licenseId?: number; // int64
  sourceHolderId?: number; // int64
  sourceHolderType?: string;
  title?: string;
  type?: string;
  fromDate?: string; // date-time
  geoPrivacy?: boolean;
  groupId?: number; // int64
  habitatId?: number; // int64
  latitude?: number; // double
  locationAccuracy?: string;
  longitude?: number; // double
  placeName?: string;
  reverseGeoCodedName?: string;
  toDate?: string; // date-time
  topology?: Geometry;
  featureCount?: number; // int32
  flagCount?: number; // int32
  languageId?: number; // int64
  locationScale?: string;
  dataSetId?: number; // int64
  externalId?: string;
  externalUrl?: string;
  lastCrawled?: string; // date-time
  lastInterpreted?: string; // date-time
  originalAuthor?: string;
  viaCode?: string;
  viaId?: string;
  visitCount?: number; // int32
  rating?: number; // int32
  isDeleted?: boolean;
  dataTableId?: number; // int64
  dateAccuracy?: string;
  author?: string;
  journal?: string;
  bookTitle?: string;
  year?: string;
  month?: string;
  volume?: string;
  number?: string;
  pages?: string;
  publisher?: string;
  school?: string;
  edition?: string;
  series?: string;
  address?: string;
  chapter?: string;
  note?: string;
  editor?: string;
  organization?: string;
  howPublished?: string;
  institution?: string;
  url?: string;
  language?: string;
  file?: string;
  itemtype?: string;
  isbn?: string;
  extra?: string;
  doil?: string;
  uFileId?: number; // int64
}
export interface DocumentCoverage {
  id?: number; // int64
  documentId?: number; // int64
  placeName?: string;
  topology?: Geometry;
}
export interface DocumentCoverageData {
  placename?: string;
  topology?: string;
}
export interface DocumentCreateData {
  contribution?: string;
  attribution?: string;
  licenseId?: number; // int64
  fromDate?: string; // date-time
  rating?: number; // int32
  bibFieldData?: BibFieldsData;
  mimeType?: string;
  resourceURL?: string;
  size?: string;
  tags?: Tags[];
  speciesGroupIds?: number /* int64 */[];
  habitatIds?: number /* int64 */[];
  geoentitiesId?: number /* int64 */[];
  docCoverageData?: DocumentCoverageData[];
  userGroupId?: number /* int64 */[];
}
export interface DocumentMailData {
  documentId?: number; // int64
  createdOn?: string; // date-time
  authorId?: number; // int64
}
export interface DocumentUserPermission {
  userGroupMember?: UserGroupIbp[];
  userGroupFeature?: UserGroupIbp[];
  following?: boolean;
}
export interface Envelope {
  maxX?: number; // double
  maxY?: number; // double
  area?: number; // double
  width?: number; // double
  height?: number; // double
  minX?: number; // double
  minY?: number; // double
  null?: boolean;
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
  userData?: unknown;
  simple?: boolean;
  numGeometries?: number; // int32
  rectangle?: boolean;
  area?: number; // double
  centroid?: Point;
  interiorPoint?: Point;
  boundary?: Geometry;
  boundaryDimension?: number; // int32
  envelopeInternal?: Envelope;
  coordinate?: Coordinate;
  srid?: number; // int32
  geometryType?: string;
  precisionModel?: PrecisionModel;
  coordinates?: Coordinate[];
  numPoints?: number; // int32
  valid?: boolean;
  dimension?: number; // int32
  length?: number; // double
  empty?: boolean;
}
export interface GeometryFactory {
  precisionModel?: PrecisionModel;
  coordinateSequenceFactory?: CoordinateSequenceFactory;
  srid?: number; // int32
}
export interface Habitat {
  id?: number; // int64
  habitatOrder?: number; // int32
  name?: string;
}
export interface Language {
  id?: number; // int64
  name?: string;
  threeLetterCode?: string;
  isDirty?: boolean;
  region?: string;
}
export interface MailData {
  observationData?: ObservationMailData;
  documentMailData?: DocumentMailData;
  userGroupData?: UserGroupMailData[];
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
export interface Point {
  envelope?: Geometry;
  factory?: GeometryFactory;
  userData?: unknown;
  coordinates?: Coordinate[];
  simple?: boolean;
  boundary?: Geometry;
  boundaryDimension?: number; // int32
  coordinateSequence?: CoordinateSequence;
  coordinate?: Coordinate;
  geometryType?: string;
  numPoints?: number; // int32
  dimension?: number; // int32
  y?: number; // double
  x?: number; // double
  empty?: boolean;
  numGeometries?: number; // int32
  rectangle?: boolean;
  area?: number; // double
  centroid?: Point;
  interiorPoint?: Point;
  envelopeInternal?: Envelope;
  srid?: number; // int32
  precisionModel?: PrecisionModel;
  valid?: boolean;
  length?: number; // double
}
export interface PrecisionModel {
  scale?: number; // double
  maximumSignificantDigits?: number; // int32
  offsetY?: number; // double
  offsetX?: number; // double
  floating?: boolean;
  type?: Type;
}
export interface ShowDocument {
  document?: Document;
  userIbp?: UserIbp;
  documentCoverages?: DocumentCoverage[];
  userGroupIbp?: UserGroupIbp[];
  featured?: Featured[];
  uFile?: UFile;
  habitatIds?: number /* int64 */[];
  speciesGroupIds?: number /* int64 */[];
  flag?: FlagShow[];
  tags?: Tags[];
}
export interface SpeciesGroup {
  id?: number; // int64
  name?: string;
  parentGroupId?: number; // int64
  groupOrder?: number; // int32
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
export interface Type {}
export interface UFile {
  id?: number; // int64
  version?: number; // int64
  downloads?: number; // int32
  mimeType?: string;
  path?: string;
  size?: string;
  weight?: number; // int32
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
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
