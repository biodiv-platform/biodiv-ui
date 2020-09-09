import React from "react";

import TextFilter from "./text-filter";
import CategoricalFilter from "./categorical-filter";

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
