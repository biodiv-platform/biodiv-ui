import { DEFAULT_LANGUAGE_ID } from "@static/constants";

export const STATIC_GROUP_PAYLOAD = {
  languageId: DEFAULT_LANGUAGE_ID,
  sendDigestMail: true,
  homePage: null,
  domainName: null,
  theme: "default",
  newFilterRule: null
};

export const DATA_TYPE = [
  { label: "Integer", value: "INTEGER" },
  { label: "Decimal", value: "DECIMAL" },
  { label: "Text", value: "STRING" },
  { label: "Date", value: "DATE" }
];

export const FIELD_TYPE = [
  { label: "Single categorical", value: "SINGLE CATEGORICAL" },
  { label: "Multiple Categorical", value: "MULTIPLE CATEGORICAL" },
  { label: "Range", value: "RANGE" },
  { label: "Textbox", value: "FIELD TEXT" }
];

export const BOOLEAN_OPTION = [
  { label: "True", value: true },
  { label: "False", value: false }
];

export const DEFAULT_CUSTOMFIELD_VALUE = {
  allowedParticipation: true,
  isMandatory: true,
  values: [{ name: "val1" }, { name: "val2" }]
};

export const RULES_TYPE = [
  { label: "User", value: "hasUserRule" },
  { label: "Spatial", value: "spartialDataList" },
  { label: "Taxonomic", value: "taxonomicIdList" },
  { label: "Created Date", value: "createdOnDateList" },
  { label: "Observed Date", value: "observedOnDateList" }
];
