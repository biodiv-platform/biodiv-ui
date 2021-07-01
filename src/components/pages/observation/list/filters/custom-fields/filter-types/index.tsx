import React from "react";

import CategoricalFilter from "./categorical-filter";
import TextFilter from "./text-filter";

const CustomFieldTypes = ({ field }) => {
  switch (field.fieldtype) {
    case "MULTIPLE CATEGORICAL":
    case "SINGLE CATEGORICAL":
      return <CategoricalFilter field={field} />;

    case "FIELD TEXT":
      return <TextFilter field={field} />;

    default:
      console.warn(`No Custom Field renderer implementation for '${field.fieldtype}'`);
      return null;
  }
};

export default CustomFieldTypes;
