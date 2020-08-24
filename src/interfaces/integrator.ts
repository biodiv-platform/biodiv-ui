export interface Role {
  id?: number; // int64
  version?: number; // int64
  authority?: string;
}
export interface UserProfileData {
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
  isAdmin?: boolean;
}
