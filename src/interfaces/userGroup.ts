export interface AdministrationList {
  founderList?: UserIbp[];
  moderatorList?: UserIbp[];
}
export interface AuthenticationDTO {
  credentials?: UserDTO;
  groupId?: number; // int64
}
export interface BulkGroupPostingData {
  userGroupList?: number /* int64 */[];
  ugObvFilterDataList?: UserGroupObvFilterData[];
}
export interface BulkGroupUnPostingData {
  userGroupList?: number /* int64 */[];
  observationList?: number /* int64 */[];
}
export interface CustomFieldCreateData {
  name?: string;
  dataType?: string;
  fieldType?: string;
  iconURL?: string;
  notes?: string;
  units?: string;
  userGroupId?: number; // int64
  defaultValue?: string;
  displayOrder?: number; // int32
  isMandatory?: boolean;
  allowedParticipation?: boolean;
  values?: CustomFieldValuesCreateData[];
}
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
export interface CustomFieldFactsInsertData {
  factsCreateData?: CustomFieldFactsInsert;
  mailData?: MailData;
}
export interface CustomFieldObservationData {
  userGroupId?: number; // int64
  customField?: CustomFieldData[];
}
export interface CustomFieldPermission {
  userGroupId?: number; // int64
  allowedCfId?: number /* int64 */[];
}
export interface CustomFieldReordering {
  cfId?: number; // int64
  displayOrder?: number; // int64
}
export interface CustomFieldUGData {
  customFieldId?: number; // int64
  defaultValue?: string;
  displayOrder?: number; // int32
  isMandatory?: boolean;
  allowedParticipation?: boolean;
}
export interface CustomFieldValues {
  id?: number; // int64
  customFieldId?: number; // int64
  values?: string;
  iconURL?: string;
  notes?: string;
}
export interface CustomFieldValuesCreateData {
  value?: string;
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
export interface DocumentMailData {
  documentId?: number; // int64
  createdOn?: string; // date-time
  authorId?: number; // int64
}
export interface EncryptionKey {
  token?: string;
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
export interface FeaturedCreateData {
  featuredCreate?: FeaturedCreate;
  mailData?: MailData;
}
export interface GroupGallerySlider {
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
  displayOrder?: number; // int64
}
export interface GroupHomePageData {
  showGallery?: boolean;
  showStats?: boolean;
  showRecentObservation?: boolean;
  showGridMap?: boolean;
  showPartners?: boolean;
  showDesc?: boolean;
  description?: string;
  stats?: Stats;
  gallerySlider?: GroupGallerySlider[];
}
export interface MailData {
  observationData?: ObservationMailData;
  documentMailData?: DocumentMailData;
  userGroupData?: UserGroupMailData[];
  speciesData?: SpeciesMailData;
}
export interface Newsletter {
  id?: number; // int64
  version?: number; // int64
  date?: string; // date-time
  title?: string;
  userGroupId?: number; // int64
  displayOrder?: number; // int32
  languageId?: number; // int64
  parentId?: number; // int64
  showInFooter?: boolean;
  sticky?: boolean;
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
export interface ReorderingHomePage {
  galleryId?: number; // int64
  displayOrder?: number; // int64
}
export interface ShowFilterRule {
  hasSpatialRule?: boolean;
  spartialRuleList?: UserGroupSpatialData[];
  hasTaxonomicRule?: boolean;
  taxonomicRuleList?: UserGroupTaxonomicRule[];
  hasUserRule?: boolean;
  hasCreatedOnDateRule?: boolean;
  createdOnDateRuleList?: UserGroupCreatedOnDateRule[];
  hasObservedOnDateRule?: boolean;
  observedOnDateRule?: UserGroupObservedonDateRule[];
}
export interface SpeciesMailData {
  speciesId?: number; // int64
  speciesName?: string;
  iconUrl?: string;
  authorId?: number; // int64
}
export interface Stats {
  species?: number; // int64
  observation?: number; // int64
  maps?: number; // int64
  documents?: number; // int64
  discussions?: number; // int64
  activeUser?: number; // int64
}
export interface UserDTO {
  id?: number; // int64
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  latitude?: number; // double
  longitude?: number; // double
  location?: string;
  mobileNumber?: string;
  gender?: string;
  profession?: string;
  institution?: string;
  mapLocation?: string;
  verificationType?: string;
  mode?: string;
  recaptcha?: string;
}
export interface UserGroup {
  id?: number; // int64
  allow_members_to_make_species_call?: boolean;
  allow_non_members_to_comment?: boolean;
  allow_obv_cross_posting?: boolean;
  allowUserToJoin?: boolean;
  description?: string;
  domianName?: string;
  foundedOn?: string; // date-time
  homePage?: string;
  icon?: string;
  isDeleted?: boolean;
  name?: string;
  neLatitude?: number; // double
  neLongitude?: number; // double
  swLatitude?: number; // double
  swLongitude?: number; // double
  theme?: string;
  visitCount?: number; // int64
  webAddress?: string;
  languageId?: number; // int64
  sendDigestMail?: boolean;
  startDate?: string; // date-time
  filterRule?: string;
  newFilterRule?: string;
  showGallery?: boolean;
  showStats?: boolean;
  showRecentObservations?: boolean;
  showGridMap?: boolean;
  showPartners?: boolean;
  showDesc?: boolean;
  habitatIds?: number /* int64 */[];
  speciesGroupIds?: number /* int64 */[];
}
export interface UserGroupAddMemebr {
  founderList?: number /* int64 */[];
  moderatorList?: number /* int64 */[];
  memberList?: number /* int64 */[];
}
export interface UserGroupCreateData {
  allowUserToJoin?: boolean;
  description?: string;
  homePage?: string;
  icon?: string;
  domainName?: string;
  name?: string;
  speciesGroup?: number /* int64 */[];
  habitatId?: number /* int64 */[];
  neLatitude?: number; // double
  neLongitude?: number; // double
  swLatitude?: number; // double
  swLongitude?: number; // double
  theme?: string;
  languageId?: number; // int64
  sendDigestMail?: boolean;
  newFilterRule?: string;
  invitationData?: UserGroupInvitationData;
}
export interface UserGroupCreatedOnDateRule {
  id?: number; // int64
  userGroupId?: number; // int64
  fromDate?: string; // date-time
  toDate?: string; // date-time
  isEnabled?: boolean;
}
export interface UserGroupDocCreateData {
  documentId?: number; // int64
  userGroupIds?: number /* int64 */[];
  mailData?: MailData;
}
export interface UserGroupEditData {
  allowUserToJoin?: boolean;
  description?: string;
  homePage?: string;
  icon?: string;
  domainName?: string;
  name?: string;
  neLatitude?: number; // double
  neLongitude?: number; // double
  swLatitude?: number; // double
  swLongitude?: number; // double
  theme?: string;
  languageId?: number; // int64
  sendDigestMail?: boolean;
  newFilterRule?: string;
  speciesGroupId?: number /* int64 */[];
  habitatId?: number /* int64 */[];
}
export interface UserGroupFilterDate {
  fromDate?: string; // date-time
  toDate?: string; // date-time
}
export interface UserGroupFilterEnable {
  filterId?: number; // int64
  isEnabled?: boolean;
  filterType?: string;
}
export interface UserGroupFilterRemove {
  filterName?: string;
  filterId?: number; // int64
}
export interface UserGroupFilterRuleInputData {
  hasUserRule?: boolean;
  taxonomicIdList?: number /* int64 */[];
  spartialDataList?: string[];
  createdOnDateList?: UserGroupFilterDate[];
  observedOnDateList?: UserGroupFilterDate[];
}
export interface UserGroupHomePageEditData {
  showGallery?: boolean;
  showStats?: boolean;
  showRecentObservation?: boolean;
  showGridMap?: boolean;
  showPartners?: boolean;
  showDesc?: boolean;
  description?: string;
  gallerySlider?: GroupGallerySlider[];
}
export interface UserGroupIbp {
  id?: number; // int64
  name?: string;
  icon?: string;
  webAddress?: string;
  isParticipatory?: boolean;
}
export interface UserGroupInvitationData {
  userGroupId?: number; // int64
  founderIds?: number /* int64 */[];
  moderatorsIds?: number /* int64 */[];
  founderEmail?: string[];
  moderatorsEmail?: string[];
}
export interface UserGroupMailData {
  id?: number; // int64
  name?: string;
  icon?: string;
  webAddress?: string;
}
export interface UserGroupMappingCreateData {
  mailData?: MailData;
  userGroups?: number /* int64 */[];
  ugFilterData?: UserGroupObvFilterData;
}
export interface UserGroupMemberRole {
  userGroupId?: number; // int64
  roleId?: number; // int64
  getsUserId?: number; // int64
}
export interface UserGroupObservedonDateRule {
  id?: number; // int64
  userGroupId?: number; // int64
  fromDate?: string; // date-time
  toDate?: string; // date-time
  isEnabled?: boolean;
}
export interface UserGroupObvFilterData {
  observationId?: number; // int64
  latitude?: number; // double
  longitude?: number; // double
  createdOnDate?: string; // date-time
  observedOnDate?: string; // date-time
  taxonomyId?: number; // int64
  authorId?: number; // int64
}
export interface UserGroupPermissions {
  userMemberRole?: UserGroupMemberRole[];
  userFeatureRole?: UserGroupMemberRole[];
}
export interface UserGroupSpatialData {
  id?: number; // int64
  userGroupId?: number; // int64
  spatialData?: string;
  isEnabled?: boolean;
}
export interface UserGroupSpeciesCreateData {
  userGroupIds?: number /* int64 */[];
}
export interface UserGroupSpeciesGroup {
  userGroupId?: number; // int64
  speciesGroupId?: number; // int64
}
export interface UserGroupTaxonomicRule {
  id?: number; // int64
  userGroupId?: number; // int64
  taxonomyId?: number; // int64
  isEnabled?: boolean;
}
export interface UserGroupWKT {
  wkt?: string;
}
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
