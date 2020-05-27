export interface BodyPart {
  entity?: Record<string, unknown>;
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  parent?: MultiPart;
  providers?: Providers;
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
  contentDisposition?: ContentDisposition;
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
export interface DOMConfiguration {
  parameterNames?: DOMStringList;
}
export interface DOMImplementation {}
export interface DOMStringList {
  length?: number; // int32
}
export interface Document {
  xmlVersion?: string;
  strictErrorChecking?: boolean;
  documentURI?: string;
  xmlStandalone?: boolean;
  doctype?: DocumentType;
  documentElement?: Element;
  inputEncoding?: string;
  xmlEncoding?: string;
  domConfig?: DOMConfiguration;
  implementation?: DOMImplementation;
  nodeName?: string;
  nodeValue?: string;
  nodeType?: number; // int32
  parentNode?: Node;
  childNodes?: NodeList;
  firstChild?: Node;
  lastChild?: Node;
  previousSibling?: Node;
  nextSibling?: Node;
  ownerDocument?: Document;
  prefix?: string;
  baseURI?: string;
  textContent?: string;
  namespaceURI?: string;
  localName?: string;
  attributes?: NamedNodeMap;
}
export interface DocumentType {
  entities?: NamedNodeMap;
  notations?: NamedNodeMap;
  publicId?: string;
  systemId?: string;
  internalSubset?: string;
  name?: string;
  nodeName?: string;
  nodeValue?: string;
  nodeType?: number; // int32
  parentNode?: Node;
  childNodes?: NodeList;
  firstChild?: Node;
  lastChild?: Node;
  previousSibling?: Node;
  nextSibling?: Node;
  ownerDocument?: Document;
  prefix?: string;
  baseURI?: string;
  textContent?: string;
  namespaceURI?: string;
  localName?: string;
  attributes?: NamedNodeMap;
}
export interface Element {
  tagName?: string;
  schemaTypeInfo?: TypeInfo;
  nodeName?: string;
  nodeValue?: string;
  nodeType?: number; // int32
  parentNode?: Node;
  childNodes?: NodeList;
  firstChild?: Node;
  lastChild?: Node;
  previousSibling?: Node;
  nextSibling?: Node;
  ownerDocument?: Document;
  prefix?: string;
  baseURI?: string;
  textContent?: string;
  namespaceURI?: string;
  localName?: string;
  attributes?: NamedNodeMap;
}
export interface FormDataBodyPart {
  entity?: Record<string, unknown>;
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  parent?: MultiPart;
  providers?: Providers;
  simple?: boolean;
  formDataContentDisposition?: FormDataContentDisposition;
  contentDisposition?: ContentDisposition;
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
  entity?: Record<string, unknown>;
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  parent?: MultiPart;
  providers?: Providers;
  bodyParts?: BodyPart[];
  fields?: {
    [name: string]: FormDataBodyPart[];
  };
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
  contentDisposition?: ContentDisposition;
}
export interface GeoserverLayerStyles {
  styleName?: string;
  styleTitle?: string;
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
export interface MultiPart {
  entity?: Record<string, unknown>;
  headers?: {
    [name: string]: string[];
  };
  mediaType?: MediaType;
  parent?: MultiPart;
  providers?: Providers;
  bodyParts?: BodyPart[];
  parameterizedHeaders?: {
    [name: string]: ParameterizedHeader[];
  };
  contentDisposition?: ContentDisposition;
}
export interface NamedNodeMap {
  length?: number; // int32
}
export interface Node {
  nodeName?: string;
  nodeValue?: string;
  nodeType?: number; // int32
  parentNode?: Node;
  childNodes?: NodeList;
  firstChild?: Node;
  lastChild?: Node;
  previousSibling?: Node;
  nextSibling?: Node;
  ownerDocument?: Document;
  prefix?: string;
  baseURI?: string;
  textContent?: string;
  namespaceURI?: string;
  localName?: string;
  attributes?: NamedNodeMap;
}
export interface NodeList {
  length?: number; // int32
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
export interface TypeInfo {
  typeNamespace?: string;
  typeName?: string;
}
