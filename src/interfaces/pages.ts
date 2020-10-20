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
export interface Page {
  id?: number; // int64
  title?: string;
  content?: string;
}
