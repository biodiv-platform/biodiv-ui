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
  isDeleted?: boolean;
}
export interface LandscapeShow {
  wktData?: string;
  boundingBox?: Record<string, unknown>[][];
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
