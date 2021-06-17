import React from "react";

import FilterCheckboxes from "../../shared/checkbox/checkboxs";
import TextFilterInput from "../../shared/search/input";
import { CONTENT_TYPES } from "./filter-keys";

export default function TextFilter({ field }) {
  const { id, name } = field;

  return (
    <div>
      <TextFilterInput filterKey={`custom_${id}.field_text`} label={name} mb={2} />
      <FilterCheckboxes
        filterKey={`custom_${id}.field_content`}
        options={CONTENT_TYPES}
        statKey={`groupCustomField.${name}`}
        translateKey="filters:custom_fields."
      />
    </div>
  );
}
