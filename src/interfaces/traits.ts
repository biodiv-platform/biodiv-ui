export interface DocumentMailData {
  documentId?: number; // int64
  createdOn?: string; // date-time
  authorId?: number; // int64
}
export interface FactValuePair {
  nameId?: number; // int64
  name?: string;
  valueId?: number; // int64
  value?: string;
  fromDate?: string; // date-time
  toDate?: string; // date-time
  type?: string;
  isParticipatry?: boolean;
}
export interface Facts {
  id?: number; // int64
  version?: number; // int64
  attribution?: string;
  contributorId?: number; // int64
  isDeleted?: boolean;
  licenseId?: number; // int64
  objectId?: number; // int64
  pageTaxonId?: number; // int64
  traitInstanceId?: number; // int64
  traitValueId?: number; // int64
  value?: string;
  objectType?: string;
  toValue?: string;
  fromDate?: string; // date-time
  toDate?: string; // date-time
  dataTableId?: number; // int64
}
export interface FactsCreateData {
  mailData?: MailData;
  factValuePairs?: {
    [name: string]: number /* int64 */[];
  };
  factValueString?: {
    [name: string]: string[];
  };
  pageTaxonId?: number; // int64
}
export interface FactsUpdateData {
  mailData?: MailData;
  traitValueList?: number /* int64 */[];
  valuesString?: string[];
  pageTaxonId?: number; // int64
}
export interface MailData {
  observationData?: ObservationMailData;
  documentMailData?: DocumentMailData;
  userGroupData?: UserGroupMailData[];
  speciesData?: SpeciesMailData;
}
export interface ObservationMailData {
  observationId?: number; // int64
  location?: string;
  observedOn?: string; // date-time
  iconURl?: string;
  scientificName?: string;
  commonName?: string;
  authorId?: number; // int64
}
export interface SpeciesMailData {
  speciesId?: number; // int64
  speciesName?: string;
  iconUrl?: string;
  authorId?: number; // int64
}
export interface Traits {
  traitId: number;
  id?: number; // int64
  dataType?: string;
  description?: string;
  fieldId?: number; // int64
  name?: string;
  traitTypes?: string;
  units?: string;
  isNotObservationTraits?: boolean;
  showInObservation?: boolean;
  isParticipatory?: boolean;
  isDeleted?: boolean;
  source?: string;
}
export interface TraitsValue {
  traitValueId: number;
  id?: number; // int64
  value?: string;
  icon?: string;
  traitInstanceId?: number; // int64
  isDeleted?: boolean;
}
export interface TraitsValuePair {
  traits?: Traits;
  values?: TraitsValue[];
}
export interface UserGroupMailData {
  id?: number; // int64
  name?: string;
  icon?: string;
  webAddress?: string;
}
