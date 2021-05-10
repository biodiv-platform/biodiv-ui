export interface FirebaseDTO {
  token?: string;
  title?: string;
  body?: string;
  icon?: string;
  clickAction?: string;
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
  website?: string;
  isDeleted?: boolean;
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
export interface UserDetails {
  id?: number; // int64
  userName?: string;
  name?: string;
  aboutMe?: string;
  email?: string;
  sexType?: string;
  latitude?: number; // double
  longitude?: number; // double
  mobileNumber?: string;
  occupation?: string;
  institution?: string;
  location?: string;
  website?: string;
}
export interface UserEmailPreferences {
  id?: number; // int64
  hideEmial?: boolean;
  sendNotification?: boolean;
  identificationMail?: boolean;
  sendDigest?: boolean;
  sendPushNotification?: boolean;
}
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
export interface UserPasswordChange {
  id?: number; // int64
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
export interface UserRoles {
  id?: number; // int64
  enabled?: boolean;
  accountExpired?: boolean;
  accountLocked?: boolean;
  passwordExpired?: boolean;
  roles?: Role[];
}
