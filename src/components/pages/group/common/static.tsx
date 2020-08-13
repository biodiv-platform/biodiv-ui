import SITE_CONFIG from "@configs/site-config.json";

export const STATIC_GROUP_PAYLOAD = {
  languageId: SITE_CONFIG.LANG.DEFAULT_ID,
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
