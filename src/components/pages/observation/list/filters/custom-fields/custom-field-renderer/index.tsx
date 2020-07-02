import React from "react";

import CustomFieldText from "./custom-field-text";

const CustomFieldRenderer = ({ field }) => {
  switch (field.fieldtype) {
    case "FIELD TEXT":
      return <CustomFieldText field={field} />;

    default:
      console.warn(`No Custom Field renderer implementation for '${field.fieldtype}'`);
      return null;
  }
};

export default CustomFieldRenderer;
