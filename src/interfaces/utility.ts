export interface CanonicalName {
  full?: string;
  simple?: string;
  stem?: string;
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
export interface Language {
  id?: number; // int64
  name?: string;
  threeLetterCode?: string;
  isDirty?: boolean;
  region?: string;
}
export interface MailData {
  observationData?: ObservationMailData;
  userGroupData?: UserGroupMailData[];
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
  details?: Record<string, unknown>[];
  positions?: Record<string, unknown>[];
  surrogate?: boolean;
  virus?: boolean;
  hybrid?: boolean;
  bacteria?: boolean;
  nameStringId?: string;
  parserVersion?: string;
  canonicalName?: CanonicalName;
}
export interface PortalStats {
  species?: number; // int64
  observation?: number; // int64
  maps?: number; // int64
  documents?: number; // int64
  userGroups?: number; // int64
  discussions?: number; // int64
  activeUser?: number; // int64
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
