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
export interface PageCreate {
  title?: string;
  content?: string;
  description?: string;
  userGroupId?: number; // int64
  languageId?: number; // int64
  parentId?: number; // int64
  pageIndex?: number; // int32
  pageType?: "CONTENT" | "REDIRECT";
  url?: string;
  autherId?: number; // int64
  autherName?: string;
  date?: string; // date-time
  showInFooter?: boolean;
  sticky?: boolean;
}
export interface PageShowMinimal {
  id?: number; // int64
  title?: string;
  content?: string;
  parentId?: number;
}
export interface PageTree {
  id?: number; // int64
  title?: string;
  parentId?: number; // int64
  pageIndex?: number; // int32
  children?: PageTree[];
}
export interface PageTreeUpdate {
  id?: number; // int64
  parentId?: number; // int64
  pageIndex?: number; // int32
}
export interface PageUpdate {
  id?: string;
  title?: string;
  content?: string;
  description?: string;
  pageType?: "CONTENT" | "REDIRECT";
  url?: string;
  sticky?: boolean;
  showInFooter?: boolean;
}
