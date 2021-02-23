import { DEFAULT_BIB_FIELDS_SCHEMA } from "@static/document";
import * as Yup from "yup";

export const getBibFieldsMeta = (fields) => {
  const { "item type": _1, file, ...bibFieldsSchema } = fields;

  return {
    schema: Object.entries(bibFieldsSchema).reduce(
      (schema, [key, value]) => (value ? { ...schema, [key]: Yup.string().required() } : schema),
      DEFAULT_BIB_FIELDS_SCHEMA
    ),
    fields: bibFieldsSchema
  };
};
