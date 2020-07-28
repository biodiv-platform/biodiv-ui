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
  getuFileId?: number; // int64
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
  doil?: string;
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
  type?: string;
  title?: string;
  contribution?: string;
  attribution?: string;
  licenseId?: number; // int64
  description?: string;
  fromDate?: string; // date-time
  rating?: number; // int32
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
export interface Envelope {
  area?: number; // double
  maxX?: number; // double
  maxY?: number; // double
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
export interface FlagShow {
  flag?: Flag;
  user?: UserIbp;
}
export interface Geometry {
  envelope?: Geometry;
  factory?: GeometryFactory;
  userData?: Record<string, unknown>;
  geometryType?: string;
  srid?: number; // int32
  numGeometries?: number; // int32
  coordinates?: Coordinate[];
  precisionModel?: PrecisionModel;
  coordinate?: Coordinate;
  numPoints?: number; // int32
  rectangle?: boolean;
  area?: number; // double
  centroid?: Point;
  interiorPoint?: Point;
  boundary?: Geometry;
  boundaryDimension?: number; // int32
  envelopeInternal?: Envelope;
  valid?: boolean;
  dimension?: number; // int32
  simple?: boolean;
  length?: number; // double
  empty?: boolean;
}
export interface GeometryFactory {
  precisionModel?: PrecisionModel;
  coordinateSequenceFactory?: CoordinateSequenceFactory;
  srid?: number; // int32
}
export interface Point {
  envelope?: Geometry;
  factory?: GeometryFactory;
  userData?: Record<string, unknown>;
  coordinates?: Coordinate[];
  geometryType?: string;
  coordinate?: Coordinate;
  numPoints?: number; // int32
  coordinateSequence?: CoordinateSequence;
  boundary?: Geometry;
  boundaryDimension?: number; // int32
  dimension?: number; // int32
  y?: number; // double
  x?: number; // double
  simple?: boolean;
  empty?: boolean;
  srid?: number; // int32
  numGeometries?: number; // int32
  precisionModel?: PrecisionModel;
  rectangle?: boolean;
  area?: number; // double
  centroid?: Point;
  interiorPoint?: Point;
  envelopeInternal?: Envelope;
  valid?: boolean;
  length?: number; // double
}
export interface PrecisionModel {
  scale?: number; // double
  maximumSignificantDigits?: number; // int32
  offsetX?: number; // double
  offsetY?: number; // double
  floating?: boolean;
  type?: Type;
}
export interface ShowDocument {
  document?: Document;
  userIbp?: UserIbp;
  documentCoverages?: DocumentCoverage[];
  userGroupIbp?: UserGroupIbp[];
  featured?: Featured[];
  getuFile?: UFile;
  habitatIds?: number /* int64 */[];
  speciesGroupIds?: number /* int64 */[];
  flag?: FlagShow[];
  tags?: Tags[];
}
export interface Tags {
  id?: number; // int64
  version?: number; // int64
  name?: string;
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
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
