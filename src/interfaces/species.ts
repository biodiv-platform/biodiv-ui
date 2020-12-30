export interface FieldDisplay {
  parentField?: FieldNew;
  childFields?: FieldNew[];
}
export interface FieldNew {
  id?: number; // int64
  parentId?: number; // int64
  displayOrder?: number; // int64
  label?: string;
  header?: string;
}
export interface FieldRender {
  parentField?: FieldNew;
  childField?: FieldDisplay[];
}
export interface SpeciesTrait {
  traitsValuePairList?: TraitsValuePair[];
  categoryName?: string;
}
export interface Traits {
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
