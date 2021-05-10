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
export interface ActivityIbp {
  activityDescription?: string;
  activityType?: string;
  dateCreated?: string; // date-time
  lastUpdated?: string; // date-time
}
export interface ActivityLoggingData {
  activityDescription?: string;
  rootObjectId?: number; // int64
  subRootObjectId?: number; // int64
  rootObjectType?: string;
  activityId?: number; // int64
  activityType?: string;
  mailData?: MailData;
}
export interface ActivityResult {
  activity?: ShowActivityIbp[];
  commentCount?: number; // int32
}
export interface CommentLoggingData {
  body?: string;
  rootHolderId?: number; // int64
  rootHolderType?: string;
  subRootHolderId?: number; // int64
  subRootHolderType?: string;
  mailData?: MailData;
}
export interface CommentsIbp {
  body?: string;
}
export interface DocumentActivityLogging {
  activityDescription?: string;
  rootObjectId?: number; // int64
  subRootObjectId?: number; // int64
  rootObjectType?: string;
  activityId?: number; // int64
  activityType?: string;
  mailData?: MailData;
}
export interface DocumentMailData {
  documentId?: number; // int64
  createdOn?: string; // date-time
  authorId?: number; // int64
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
export interface RecoVoteActivity {
  scientificName?: string;
  commonName?: string;
  givenName?: string;
  speciesId?: number; // int64
}
export interface ShowActivityIbp {
  activityIbp?: ActivityIbp;
  commentsIbp?: CommentsIbp;
  reply?: CommentsIbp;
  userGroup?: UserGroupActivity;
  recoVote?: RecoVoteActivity;
  userIbp?: UserIbp;
}
export interface SpeciesActivityLogging {
  activityDescription?: string;
  rootObjectId?: number; // int64
  subRootObjectId?: number; // int64
  rootObjectType?: string;
  activityId?: number; // int64
  activityType?: string;
  mailData?: MailData;
}
export interface SpeciesMailData {
  speciesId?: number; // int64
  speciesName?: string;
  iconUrl?: string;
  authorId?: number; // int64
}
export interface UserGroupActivity {
  userGroupId?: number; // int64
  userGroupName?: string;
  webAddress?: string;
  featured?: string;
  reason?: string;
}
export interface UserGroupActivityLogging {
  activityDescription?: string;
  rootObjectId?: number; // int64
  subRootObjectId?: number; // int64
  rootObjectType?: string;
  activityId?: number; // int64
  activityType?: string;
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
