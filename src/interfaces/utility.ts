export interface CanonicalName {
  full?: string;
  simple?: string;
  stem?: string;
}
export interface DocumentMailData {
  documentId?: number; // int64
  createdOn?: string; // date-time
  authorId?: number; // int64
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
export interface FlagCreateData {
  flagIbp?: FlagIbp;
  mailData?: MailData;
}
export interface FlagIbp {
  flag?: string;
  notes?: string;
}
export interface FlagShow {
  flag?: Flag;
  user?: UserIbp;
}
export interface GallerySlider {
  id?: number; // int64
  ugId?: number; // int64
  fileName?: string;
  observationId?: number; // int64
  authorId?: number; // int64
  authorName?: string;
  authorImage?: string;
  title?: string;
  customDescripition?: string;
  moreLinks?: string;
}
export interface Habitat {
  id?: number; // int64
  habitatOrder?: number; // int32
  name?: string;
}
export interface HomePageData {
  showGallery?: boolean;
  showStats?: boolean;
  showRecentObservation?: boolean;
  showGridMap?: boolean;
  showPartners?: boolean;
  stats?: HomePageStats;
  gallerySlider?: GallerySlider[];
  ugDescription?: string;
}
export interface HomePageStats {
  species?: number; // int64
  observation?: number; // int64
  maps?: number; // int64
  documents?: number; // int64
  activeUser?: number; // int64
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
  speciesData?: SpeciesMailData;
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
export interface ParsedName {
  parsed?: boolean;
  quality?: number; // float
  verbatim?: string;
  normalized?: string;
  authorship?: string;
  details?: {
    [key: string]: any;
  }[];
  positions?: {
    [key: string]: any;
  }[];
  surrogate?: boolean;
  virus?: boolean;
  hybrid?: boolean;
  bacteria?: boolean;
  nameStringId?: string;
  parserVersion?: string;
  canonicalName?: CanonicalName;
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
export interface TagsMappingData {
  tagsMapping?: TagsMapping;
  mailData?: MailData;
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
