export interface DownloadLog {
  id?: number; // int64
  version?: number; // int64
  authorId?: number; // int64
  createdOn?: string; // date-time
  filterUrl?: string;
  notes?: string;
  paramsMapAsText?: string;
  status?: string;
  type?: string;
  sourceType?: string;
  offsetParam?: number; // int64
}
export interface FieldTemplate {
  id?: number; // int64
  parentId?: number; // int64
  fieldIndex?: number; // int64
  createdOn?: string; // date-time
  modifiedOn?: string; // date-time
  isDeleted?: boolean;
}
export interface Landscape {
  id?: number; // int64
  shortName?: string;
  siteNumber?: number; // int64
  geoEntityId?: number; // int64
  thumbnailPath?: string;
  isDeleted?: boolean;
}
export interface LandscapeShow {
  wktData?: string;
  boundingBox?: {
    [key: string]: any;
  }[][];
  contents?: TemplateTreeStructure;
}
export interface Language {
  id?: number; // int64
  name?: string;
  threeLetterCode?: string;
  twoLetterCode?: string;
  isDirty?: boolean;
  region?: string;
}
export interface TemplateHeader {
  id?: number; // int64
  templateId?: number; // int64
  languageId?: number; // int64
  header?: string;
  isDeleted?: boolean;
}
export interface TemplateTreeStructure {
  id?: number; // int64
  pageFieldId?: number; // int64
  header?: string;
  content?: string;
  childs?: TemplateTreeStructure[];
}
