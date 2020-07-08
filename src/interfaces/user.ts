export interface FirebaseDTO {
  token?: string;
  title?: string;
  body?: string;
  icon?: string;
}
export interface FirebaseTokens {
  id?: number; // int64
  token?: string;
}
export interface Follow {
  id?: number; // int64
  version?: number; // int64
  objectId?: number; // int64
  objectType?: string;
  authorId?: number; // int64
  createdOn?: string; // date-time
}
export interface GroupAddMember {
  userGroupId?: number; // int64
  roleId?: number; // int64
  memberList?: number /* int64 */[];
}
export interface Recipients {
  id?: number; // int64
  name?: string;
  email?: string;
  isSubscribed?: boolean;
  tokens?: string[];
}
export interface Role {
  id?: number; // int64
  version?: number; // int64
  authority?: string;
}
export interface SpeciesPermission {
  id?: number; // int64
  version?: number; // int64
  authorId?: number; // int64
  createdOn?: string; // date-time
  permissionType?: string;
  taxonConceptId?: number; // int64
}
export interface User {
  id?: number; // int64
  version?: number; // int64
  accountExpired?: boolean;
  accountLocked?: boolean;
  passwordExpired?: boolean;
  languageId?: number; // int64
  enabled?: boolean;
  userName?: string;
  aboutMe?: string;
  email?: string;
  hideEmial?: boolean;
  name?: string;
  profilePic?: string;
  icon?: string;
  sexType?: string;
  dateCreated?: string; // date-time
  latitude?: number; // double
  longitude?: number; // double
  mobileNumber?: string;
  occupation?: string;
  institution?: string;
  location?: string;
  sendNotification?: boolean;
  emailValidation?: boolean;
  mobileValidation?: boolean;
  lastLoginDate?: string; // date-time
  roles?: Role[];
  timezone?: number; // float
  identificationMail?: boolean;
  sendDigest?: boolean;
  sendPushNotification?: boolean;
  tokens?: FirebaseTokens[];
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
export interface UserGroupMemberRole {
  userGroupId?: number; // int64
  roleId?: number; // int64
  getsUserId?: number; // int64
}
export interface UserGroupMembersCount {
  userGroupId?: number; // int64
  count?: number; // int64
}
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
export interface UserPermissions {
  allowedTaxonList?: SpeciesPermission[];
  userMemberRole?: UserGroupMemberRole[];
  userFeatureRole?: UserGroupMemberRole[];
  following?: boolean;
}
