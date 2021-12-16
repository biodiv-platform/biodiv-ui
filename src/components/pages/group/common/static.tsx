export const STATIC_GROUP_PAYLOAD = {
  homePage: null,
  domainName: null,
  theme: "default",
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
  { label: "Textbox", value: "FIELD TEXT" }
];

export const DEFAULT_CUSTOMFIELD_VALUE = {
  allowedParticipation: true,
  isMandatory: true,
  values: [
    { value: "", notes: "" },
    { value: "", notes: "" }
  ]
};

export const RULES_TYPE = [
  { label: "User", value: "hasUserRule" },
  { label: "Spatial", value: "spartialDataList" },
  { label: "Taxonomic", value: "taxonomicIdList" },
  { label: "Created Date", value: "createdOnDateList" },
  { label: "Observed Date", value: "observedOnDateList" }
];
