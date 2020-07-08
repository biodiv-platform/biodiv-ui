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
  { label: "Integer", value: "integer" },
  { label: "Decimal", value: "decimal" },
  { label: "Text", value: "text" },
  { label: "Date", value: "date" }
];

export const fieldType = [
  { label: "Single categorical", value: "singleCategorical" },
  { label: "Multiple Categorical", value: "multipleCategorical" },
  { label: "Range", value: "range" },
  { label: "Textbox", value: "textbox" }
];

export const booleanOption = [
  { label: "True", value: true },
  { label: "False", value: false }
];
