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
export interface File {
  id?: number; // int64
  path?: string;
  fileName?: string;
}
export interface FileUploadModel {
  hashKey?: string;
  fileName?: string;
  type?: string;
  uri?: string;
  error?: string;
  o?: {
    [name: string]: {
      [key: string]: any;
    };
  };
  uploaded?: boolean;
}
export interface FilesDTO {
  files?: string[];
  folder?: string;
  module?: string;
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
export interface MyUpload {
  hashKey?: string;
  fileName?: string;
  type?: string;
  path?: string;
  dateCreated?: string; // date-time
  dateUploaded?: string; // date-time
  latitude?: number; // double
  longitude?: number; // double
  fileSize?: string;
}
export interface MyCsvUpload extends MyUpload {
  excelJson?: { csvHeaders: string[] };
}
export interface ParameterizedHeader {
  value?: string;
  parameters?: {
    [name: string]: string;
  };
}
export interface Providers {}
export interface StreamingOutput {}
