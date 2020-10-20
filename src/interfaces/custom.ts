import {
  MapAggregationResponse,
  ObservationListMinimalData,
  ObservationListPageMapper
} from "./observation";

export enum ResourceType {
  Video = "VIDEO",
  Image = "IMAGE",
  Audio = "AUDIO"
}

export enum Role {
  Any = "ANY",
  User = "ROLE_USER",
  Admin = "ROLE_ADMIN",
  UsergroupFounder = "ROLE_USERGROUP_FOUNDER",
  UsergroupExpert = "ROLE_USERGROUP_EXPERT",
  UsergroupMember = "ROLE_USERGROUP_MEMBER",
  CEPFAdmin = "ROLE_CEPF_ADMIN",
  SpeciesAdmin = "ROLE_SPECIES_ADMIN"
}

export interface License {
  name: string;
  link: string;
}

export interface ObservationResource {
  hashKey: string;
  fileName: string;
  type: string;
  uri: string;
  error: string;
  uploaded: boolean;
  license;
  caption: string;
  ratings: number;
}

export interface ObservationFilterProps {
  sGroup?;
  taxon?: string;
  user?: string;
  userGroupList?: string;
  webaddress?: string;
  speciesName?: string;
  mediaFilter?: string;
  months?: string;
  isFlagged?: string;
  location?: string;
  sort?: string;
  minDate?: string;
  createdOnMaxDate?: string;
  createdOnMinDate?: string;
  status?: string;
  taxonId?: string;
  validate?: string;
  recoName?: string;
  classifdication?: string;
  max?: number;
  offset?: number;
  geoAggregationField?: string;
  geoAggegationPrecision?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  recom?: string;
  onlyFilteredAggregation?: boolean;
  termsAggregationField?: string;
  view?: string;
  rank?: string;
  tahsil?: string;
  district?: string;
  state?: string;
}

export interface ObservationData {
  l: ObservationListPageMapper[];
  ml: ObservationListMinimalData[];
  ag: MapAggregationResponse;
  mvp: Record<string, unknown>;
  n: number;
  hasMore: boolean;
}

export interface DocumentData {
  l: any[];
  mvp: Record<string, unknown>;
  n: number;
  hasMore: boolean;
}

export interface Omit {
  <T extends Record<string, unknown>, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

export enum AssetStatus {
  Pending = 1,
  InProgress = 2,
  Uploaded = 3,
  Failed = 4
}

export interface IDBObservationAsset {
  id?: number;
  hashKey: string;
  fileName?: string;
  path?: string;
  url?: string;
  type: string;
  licenceId: string;
  status?: AssetStatus;
  caption?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  blob?: any;
  isUsed?: number;
  dateCreated?: number;
  dateUploaded?: number;
}

export interface IDBPendingObservation {
  id?: number;
  data: any;
}

export interface LeaderboardFilterProps {
  module: string;
  period: string;
  limit: number;
}

export interface ResourceDocument {
  resourceURL: string;
  size: string;
  timestamp: number;
}
