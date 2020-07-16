import { DEFAULT_LANGUAGE_ID } from "@static/constants";

export const STATIC_GROUP_PAYLOAD = {
  languageId: DEFAULT_LANGUAGE_ID,
  sendDigestMail: true,
  homePage: null,
  domainName: null,
  theme: "default",
  newFilterRule: null
};

export const dataType = [
  { label: "Integer", value: "INTEGER" },
  { label: "Decimal", value: "DECIMAL" },
  { label: "Text", value: "STRING" },
  { label: "Date", value: "DATE" }
];

export const fieldType = [
  { label: "Single categorical", value: "SINGLE CATEGORICAL" },
  { label: "Multiple Categorical", value: "MULTIPLE CATEGORICAL" },
  { label: "Range", value: "RANGE" },
  { label: "Textbox", value: "FIELD TEXT" }
];

export const booleanOption = [
  { label: "True", value: true },
  { label: "False", value: false }
];

export const defaultCustomFieldFormValue = {
  allowedParticipation: true,
  isMandatory: true,
  values: [{ name: "val1" }, { name: "val2" }]
};
