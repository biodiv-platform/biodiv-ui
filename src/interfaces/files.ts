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
    [name: string]: Record<string, unknown>;
  };
  uploaded?: boolean;
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
}
export interface StreamingOutput {}
