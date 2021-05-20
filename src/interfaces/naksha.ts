export interface BodyPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface ByteArrayInputStream {}
export interface ContentDisposition {
  type?: string;
  parameters?: {
    [name: string]: string;
  };
  fileName?: string;
  creationDate?: string; // date-time
  modificationDate?: string; // date-time
  readDate?: string; // date-time
  size?: number; // int64
}
export interface FormDataBodyPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  formDataContentDisposition?: FormDataContentDisposition;
  simple?: boolean;
  name?: string;
  value?: string;
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface FormDataContentDisposition {
  type?: string;
  parameters?: {
    [name: string]: string;
  };
  fileName?: string;
  creationDate?: string; // date-time
  modificationDate?: string; // date-time
  readDate?: string; // date-time
  size?: number; // int64
  name?: string;
}
export interface FormDataMultiPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  bodyParts?: BodyPart[];
  fields?: {
    [name: string]: FormDataBodyPart[];
  };
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface GeoserverLayerStyles {
  styleName?: string;
  styleTitle?: string;
  styleType?: string;
}
export interface LayerDownload {
  layerName?: string;
  attributeList?: string[];
  filterArray?: string[];
}
export interface LayerFileDescription {
  fileType?: string;
  encoding?: string;
  latColumnName?: string;
  lonColumnName?: string;
  field?: string;
  geoColumnType?: string;
  layerSRS?: string;
}
export interface LayerInfoOnClick {
  layerName?: string;
  titleColumn?: string;
  summaryColumn?: string[];
  styles?: GeoserverLayerStyles[];
}
export interface MediaType {
  type?: string;
  subtype?: string;
  parameters?: {
    [name: string]: string;
  };
  wildcardType?: boolean;
  wildcardSubtype?: boolean;
}
export interface MessageBodyWorkers {}
export interface MetaData {
  layerName?: string;
  layerDescription?: string;
  layerType?: "RASTER" | "MULTIPOLYGON" | "POINT" | "MULTILINESTRING" | "MULTIPOINT";
  geoColumn?: string;
  minScale?: number; // double
  maxScale?: number; // double
  pdfLink?: string;
  url?: string;
  attribution?: string;
  tags?: string;
  license?: string;
  summaryColumns?: string;
  downloadAccess?: "PRIVATE" | "GROUP" | "ALL";
  editAccess?: "PRIVATE" | "GROUP" | "ALL";
  colorBy?: string;
  titleColumn?: string;
  sizeBy?: string;
  mediaColumns?: string;
  pageId?: number; // int64
  italicsColumns?: string;
  createdBy?: string;
  createdDate?: string; // date-time
  modifiedBy?: string;
  modifiedDate?: string; // date-time
  layerFileDescription?: LayerFileDescription;
  layerColumnDescription?: {
    [name: string]: string;
  };
}
export interface MetaLayer {
  id?: number; // int64
  layerName?: string;
  layerTableName?: string;
  layerDescription?: string;
  layerType?: "RASTER" | "MULTIPOLYGON" | "POINT" | "MULTILINESTRING" | "MULTIPOINT";
  layerStatus?: "PENDING" | "INACTIVE" | "ACTIVE";
  geoColumn?: string;
  minScale?: number; // double
  maxScale?: number; // double
  pdfLink?: string;
  url?: string;
  dirPath?: string;
  uploaderUserId?: number; // int64
  attribution?: string;
  tags?: string;
  license?: string;
  summaryColumns?: string;
  downloadAccess?: "PRIVATE" | "GROUP" | "ALL";
  editAccess?: "PRIVATE" | "GROUP" | "ALL";
  colorBy?: string;
  titleColumn?: string;
  sizeBy?: string;
  mediaColumns?: string;
  pageId?: number; // int64
  italicsColumns?: string;
  createdBy?: string;
  createdDate?: string; // date-time
  modifiedBy?: string;
  modifiedDate?: string; // date-time
}
export interface MetaLayerEdit {
  id?: number; // int64
  layerName?: string;
  layerDescription?: string;
  layerType?: "RASTER" | "MULTIPOLYGON" | "POINT" | "MULTILINESTRING" | "MULTIPOINT";
  attribution?: string;
  tags?: string;
  license?: string;
  summaryColumns?: string;
  downloadAccess?: "PRIVATE" | "GROUP" | "ALL";
  editAccess?: "PRIVATE" | "GROUP" | "ALL";
  colorBy?: string;
  titleColumn?: string;
  modifiedBy?: string;
  modifiedDate?: string; // date-time
  layerColumnDescription?: {
    [name: string]: string;
  };
}
export interface MultiPart {
  contentDisposition?: ContentDisposition;
  entity?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  messageBodyWorkers?: MessageBodyWorkers;
  parent?: MultiPart;
  providers?: Providers;
  bodyParts?: BodyPart[];
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
}
export interface ObservationLocationInfo {
  soil?: string;
  temp?: string;
  rainfall?: string;
  tahsil?: string;
  forestType?: string;
}
export interface ParameterizedHeader {
  value?: string;
  parameters?: {
    [name: string]: string;
  };
}
export interface Providers {}
export interface StreamingOutput {}
export interface TOCLayer {
  id?: number; // int64
  name?: string;
  title?: string;
  description?: string;
  layerType?: "RASTER" | "MULTIPOLYGON" | "POINT" | "MULTILINESTRING" | "MULTIPOINT";
  pdfLink?: string;
  url?: string;
  author?: UserIbp;
  attribution?: string;
  tags?: string[];
  license?: string;
  pageId?: number; // int64
  createdBy?: string;
  createdDate?: string; // date-time
  modifiedBy?: string;
  modifiedDate?: string; // date-time
  isDownloadable?: boolean;
  bbox?: number /* double */[][];
  thumbnail?: string;
  layerStatus?: "PENDING" | "INACTIVE" | "ACTIVE";
}
export interface UserIbp {
  id?: number; // int64
  name?: string;
  profilePic?: string;
  isAdmin?: boolean;
}
