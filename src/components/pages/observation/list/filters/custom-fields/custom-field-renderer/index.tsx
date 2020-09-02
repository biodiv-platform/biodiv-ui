import React from "react";

import CustomFieldText from "./custom-field-text";
import CategoricalCustomField from "./categorical-custom-field";

const CustomFieldRenderer = ({ field }) => {
  switch (field.fieldtype) {
    case "MULTIPLE CATEGORICAL":
    case "SINGLE CATEGORICAL":
      return <CategoricalCustomField field={field} />;
    case "FIELD TEXT":
      return <CustomFieldText field={field} />;

    default:
      console.warn(`No Custom Field renderer implementation for '${field.fieldtype}'`);
      return null;
  }
};

export default CustomFieldRenderer;
